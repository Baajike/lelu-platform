import { db } from "../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const ADMIN_ROLES = ["HEAD_OF_UNIT", "SUPERVISOR", "ADMIN"];

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const isAdmin = ADMIN_ROLES.includes(session.user.role);

    const where = isAdmin ? {} : { case: { officerId: session.user.id } };

    const entries = await db.journalEntry.findMany({
      where,
      include: {
        case: { select: { id: true, caseNumber: true, title: true } },
        author: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(entries);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
