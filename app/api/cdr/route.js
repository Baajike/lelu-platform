import { db } from "../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const ADMIN_ROLES = ["HEAD_OF_UNIT", "SUPERVISOR", "ADMIN"];

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const officerIdFilter = searchParams.get("officerId");
    const isAdmin = ADMIN_ROLES.includes(session.user.role);

    let where = {};
    if (!isAdmin) {
      where.officerId = session.user.id;
    } else if (officerIdFilter) {
      where.officerId = officerIdFilter;
    }

    const cdrs = await db.cdrRequest.findMany({
      where,
      include: {
        case: { select: { id: true, caseNumber: true, title: true } },
        officer: { select: { id: true, name: true } },
      },
      orderBy: { requestedAt: "desc" },
    });

    return Response.json(cdrs);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { phoneNumber, identifierType, telco, periodStart, periodEnd, reason, caseId } = body;

    const cdr = await db.cdrRequest.create({
      data: {
        phoneNumber,
        identifierType: identifierType || "Phone Number",
        telco: telco || null,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        reason,
        caseId: caseId || null,
        officerId: session.user.id,
      },
      include: {
        case: { select: { id: true, caseNumber: true, title: true } },
        officer: { select: { id: true, name: true } },
      },
    });

    if (cdr.caseId) {
      await db.caseActivity.create({
        data: {
          caseId: cdr.caseId,
          userId: session.user.id,
          userName: session.user.name,
          action: "CDR request logged",
          detail: `${cdr.phoneNumber} [${cdr.identifierType}]${cdr.telco ? ` (${cdr.telco})` : ""}`,
        },
      }).catch(() => {});
    }

    return Response.json(cdr, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}