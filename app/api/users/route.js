import { db } from "../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const pending = searchParams.get("pending");
    const withStats = searchParams.get("withStats");
    const deactivated = searchParams.get("deactivated");

    if (pending === "true") {
      // Pending registrations: never approved and not deactivated accounts
      const users = await db.user.findMany({
        where: { approved: false, deactivated: false, role: { not: "ADMIN" } },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      return Response.json(users);
    }

    if (deactivated === "true") {
      const users = await db.user.findMany({
        where: { deactivated: true, role: { not: "ADMIN" } },
        select: { id: true, name: true, email: true, role: true, cdrAccess: true, lastActive: true },
        orderBy: { name: "asc" },
      });
      return Response.json(users);
    }

    if (withStats === "true") {
      // Week start = Monday 00:00 local time (server-side approximation)
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (weekStart.getDay() === 0 ? 6 : weekStart.getDay() - 1));
      weekStart.setHours(0, 0, 0, 0);

      const users = await db.user.findMany({
        where: { approved: true, deactivated: false, role: { not: "ADMIN" } },
        select: {
          id: true, name: true, email: true, role: true,
          _count: {
            select: {
              cases: true,
              cdrRequests: true,
            }
          },
          cases: {
            where: { status: "Active" },
            select: { id: true },
          },
          // Journal entries written this week — used for activity score
          entries: {
            where: { createdAt: { gte: weekStart } },
            select: { id: true },
          },
        },
        orderBy: { name: "asc" },
      });
      return Response.json(users);
    }

    const users = await db.user.findMany({
      where: { approved: true, deactivated: false, role: { not: "ADMIN" } },
      select: { id: true, name: true, email: true, role: true, cdrAccess: true, lastActive: true },
      orderBy: { name: "asc" },
    });

    return Response.json(users);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}