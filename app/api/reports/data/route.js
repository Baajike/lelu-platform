import { db } from "../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const caseId = searchParams.get("caseId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const fromDate = from ? new Date(from) : new Date(new Date().getFullYear(), 0, 1);
    const toDate = to ? new Date(to) : new Date();

    if (type === "case" && caseId) {
      const caseData = await db.case.findUnique({
        where: { id: caseId },
        include: {
          officer: { select: { name: true } },
          entries: { include: { author: { select: { name: true } } }, orderBy: { dayNumber: "asc" } },
          cdrRequests: true,
          internationalRequests: true,
        },
      });
      return Response.json({ caseData });
    }

    const [cases, cdrs, activityReports, internationalRequests] = await Promise.all([
      db.case.findMany({
        where: { createdAt: { gte: fromDate, lte: toDate } },
        include: { officer: { select: { name: true } }, entries: true },
        orderBy: { createdAt: "desc" },
      }),
      db.cdrRequest.findMany({
        where: { requestedAt: { gte: fromDate, lte: toDate } },
        include: { case: { select: { caseNumber: true, title: true } }, officer: { select: { name: true } } },
      }),
      db.activityReport.findMany({
        where: { createdAt: { gte: fromDate, lte: toDate } },
        include: { officer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      db.internationalRequest.findMany({
        where: { createdAt: { gte: fromDate, lte: toDate } },
        include: { officer: { select: { name: true } } },
      }),
    ]);

    return Response.json({ cases, cdrs, activityReports, internationalRequests });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}