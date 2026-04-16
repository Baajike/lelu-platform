import { db } from "../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        approved: true,
        cdrAccess: true,
        createdAt: true,
      },
    });

    if (!user) return Response.json({ error: "User not found." }, { status: 404 });
    return Response.json(user);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
