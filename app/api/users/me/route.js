import { db } from "../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

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

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { action } = body;

    if (action === "change_password") {
      const { currentPassword, newPassword } = body;

      if (!currentPassword || !newPassword) {
        return Response.json({ error: "Current password and new password are required." }, { status: 400 });
      }
      if (newPassword.length < 8) {
        return Response.json({ error: "New password must be at least 8 characters." }, { status: 400 });
      }

      // Fetch current hashed password
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      });
      if (!user) return Response.json({ error: "User not found." }, { status: 404 });

      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return Response.json({ error: "Current password is incorrect." }, { status: 400 });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await db.user.update({
        where: { id: session.user.id },
        data: { password: hashed },
      });

      return Response.json({ success: true });
    }

    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
