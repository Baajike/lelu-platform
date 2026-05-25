import { db } from "../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const meOnly = searchParams.get("me") === "true";

    const where = meOnly ? { userId: session.user.id } : {};

    const activities = await db.caseActivity.findMany({
      where,
      include: {
        case: { select: { id: true, caseNumber: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return Response.json(activities);
  } catch (error) {
    return Response.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}
