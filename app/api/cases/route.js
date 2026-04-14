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

    // Build where clause
    let where = {};
    if (!isAdmin) {
      // Officers only see their own cases
      where.officerId = session.user.id;
    } else if (officerIdFilter) {
      // Admin filtering by a specific officer
      where.officerId = officerIdFilter;
    }

    const cases = await db.case.findMany({
      where,
      include: {
        officer: { select: { id: true, name: true } },
        entries: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(cases);
  } catch (error) {
    return Response.json({ error: "Failed to fetch cases" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, category, priority, description } = body;

    const count = await db.case.count();
    const caseNumber = `LELU-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

    const newCase = await db.case.create({
      data: {
        caseNumber,
        title,
        category,
        priority,
        description,
        officerId: session.user.id,
      },
      include: { officer: { select: { id: true, name: true } } },
    });

    return Response.json(newCase, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to create case" }, { status: 500 });
  }
}