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

    const requests = await db.internationalRequest.findMany({
      where,
      include: {
        case: { select: { id: true, caseNumber: true, title: true } },
        officer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(requests);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { direction, country, agency, subject, details, priority, caseId } = body;

    const count = await db.internationalRequest.count();
    const refNumber = `LELU-INTL-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

    const req = await db.internationalRequest.create({
      data: {
        refNumber,
        direction,
        country,
        agency,
        subject,
        details,
        priority,
        caseId: caseId || null,
        officerId: session.user.id,
      },
      include: {
        case: { select: { id: true, caseNumber: true, title: true } },
        officer: { select: { id: true, name: true } },
      },
    });

    return Response.json(req, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}