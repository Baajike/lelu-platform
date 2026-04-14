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

    if (pending === "true") {
      const users = await db.user.findMany({
        where: { approved: false },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      return Response.json(users);
    }

    if (withStats === "true") {
      const users = await db.user.findMany({
        where: { approved: true },
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
        },
        orderBy: { name: "asc" },
      });
      return Response.json(users);
    }

    const users = await db.user.findMany({
      where: { approved: true },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: "asc" },
    });

    return Response.json(users);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}