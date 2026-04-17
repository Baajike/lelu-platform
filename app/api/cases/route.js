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
      // Officers see their own cases OR cases they've been assigned to
      where.OR = [
        { officerId: session.user.id },
        { caseAssignments: { some: { userId: session.user.id, status: "Accepted" } } },
      ];
    } else if (officerIdFilter) {
      // Admin filtering by a specific officer
      where.officerId = officerIdFilter;
    }

    const cases = await db.case.findMany({
      where,
      include: {
        officer: { select: { id: true, name: true } },
        // Only the most-recent entry — used for staleness checks on the frontend.
        // Array will be length 0 or 1; entries[0].createdAt is the latest entry date.
        entries: {
          select: { id: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        caseAssignments: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { assignedAt: "asc" },
        },
        _count: { select: { entries: true } },
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
    const { title, category, description } = body;

    const newCase = await db.$transaction(async (tx) => {
      const count = await tx.case.count();
      const caseNumber = `LELU-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;
      return tx.case.create({
        data: {
          caseNumber,
          title,
          category,
          description,
          officerId: session.user.id,
        },
        include: { officer: { select: { id: true, name: true } } },
      });
    });

    await db.caseActivity.create({
      data: {
        caseId: newCase.id,
        userId: session.user.id,
        userName: session.user.name,
        action: "Case opened",
        detail: `${caseNumber} — ${title}`,
      },
    }).catch(() => {});

    return Response.json(newCase, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to create case" }, { status: 500 });
  }
}