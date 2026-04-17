import { db } from "../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const notifications = await db.notification.findMany({
      where: { userId: session.user.id, read: false },
      orderBy: { createdAt: "desc" },
    });

    // Enrich CASE_INVITATION notifications with live assignment status
    const enriched = await Promise.all(
      notifications.map(async (n) => {
        if (n.type === "CASE_INVITATION" && n.meta) {
          try {
            const meta = JSON.parse(n.meta);
            const assignment = await db.caseAssignment.findUnique({
              where: { id: meta.assignmentId },
              select: { id: true, status: true, caseId: true },
            });
            return {
              ...n,
              assignmentId: meta.assignmentId,
              assignmentStatus: assignment?.status ?? null,
            };
          } catch {
            return n;
          }
        }
        return n;
      })
    );

    return Response.json(enriched);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    if (body.all) {
      await db.notification.updateMany({
        where: { userId: session.user.id },
        data: { read: true },
      });
    } else if (body.id) {
      await db.notification.updateMany({
        where: { id: body.id, userId: session.user.id },
        data: { read: true },
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
