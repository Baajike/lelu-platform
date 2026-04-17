import { db } from "../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const type      = searchParams.get("type");
    const caseId    = searchParams.get("caseId");
    const from      = searchParams.get("from");
    const to        = searchParams.get("to");
    const officerId = searchParams.get("officerId");
    const team      = searchParams.get("team");

    const fromDate = from ? new Date(from) : new Date(new Date().getFullYear(), 0, 1);
    const toDate   = to   ? new Date(to)   : new Date();

    // ── Team report — all officers, full breakdown ────────────────────────
    if (team === "true") {
      if (!["HEAD_OF_UNIT", "ADMIN", "SUPERVISOR"].includes(session.user.role)) {
        return Response.json({ error: "Forbidden." }, { status: 403 });
      }
      const [cases, cdrs, intl, entries, users] = await Promise.all([
        db.case.findMany({
          where: { createdAt: { gte: fromDate, lte: toDate } },
          include: { officer: { select: { id: true, name: true } }, entries: true },
          orderBy: { createdAt: "desc" },
        }),
        db.cdrRequest.findMany({
          where: { requestedAt: { gte: fromDate, lte: toDate } },
          include: {
            case: { select: { caseNumber: true, title: true } },
            officer: { select: { id: true, name: true } },
          },
        }),
        db.internationalRequest.findMany({
          where: { createdAt: { gte: fromDate, lte: toDate } },
          include: { officer: { select: { id: true, name: true } } },
        }),
        db.journalEntry.findMany({
          where: { createdAt: { gte: fromDate, lte: toDate } },
          include: { author: { select: { id: true, name: true } } },
        }),
        db.user.findMany({
          where: { approved: true, deactivated: false },
          select: { id: true, name: true, role: true },
          orderBy: { name: "asc" },
        }),
      ]);
      return Response.json({ cases, cdrs, internationalRequests: intl, entries, users });
    }

    // ── Single case report ────────────────────────────────────────────────
    if (type === "case" && caseId) {
      const caseData = await db.case.findUnique({
        where: { id: caseId },
        include: {
          officer: { select: { name: true } },
          entries: {
            include: { author: { select: { name: true } } },
            orderBy: { dayNumber: "asc" },
          },
          cdrRequests: true,
          internationalRequests: true,
        },
      });
      return Response.json({ caseData });
    }

    // ── Officer filter (admin selecting a specific officer) ───────────────
    const officerFilter = officerId ? { officerId } : {};

    const [cases, cdrs, activityReports, internationalRequests] = await Promise.all([
      db.case.findMany({
        where: { createdAt: { gte: fromDate, lte: toDate }, ...officerFilter },
        include: { officer: { select: { name: true } }, entries: true },
        orderBy: { createdAt: "desc" },
      }),
      db.cdrRequest.findMany({
        where: { requestedAt: { gte: fromDate, lte: toDate }, ...officerFilter },
        include: {
          case: { select: { caseNumber: true, title: true } },
          officer: { select: { name: true } },
        },
      }),
      db.activityReport.findMany({
        where: { createdAt: { gte: fromDate, lte: toDate }, ...officerFilter },
        include: { officer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      db.internationalRequest.findMany({
        where: { createdAt: { gte: fromDate, lte: toDate }, ...officerFilter },
        include: { officer: { select: { name: true } } },
      }),
    ]);

    return Response.json({ cases, cdrs, activityReports, internationalRequests });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
