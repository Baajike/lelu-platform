import { db } from "../../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const role = session.user.role;
    if (!["HEAD_OF_UNIT", "OFFICE_ADMINISTRATOR", "ADMIN"].includes(role)) {
      return Response.json({ error: "Insufficient permissions." }, { status: 403 });
    }

    const { userId } = await params;
    const body = await request.json();
    const { action, cdrAccess } = body;

    // Update CDR access toggle
    if (cdrAccess !== undefined && action === undefined) {
      if (!["HEAD_OF_UNIT", "ADMIN"].includes(role)) {
        return Response.json({ error: "Only HEAD_OF_UNIT or ADMIN can manage CDR access." }, { status: 403 });
      }
      const user = await db.user.update({
        where: { id: userId },
        data: { cdrAccess: Boolean(cdrAccess) },
      });
      return Response.json(user);
    }

    if (action === "approve") {
      const user = await db.user.update({
        where: { id: userId },
        data: { approved: true },
      });
      return Response.json(user);
    }

    if (action === "reject") {
      await db.user.delete({ where: { id: userId } });
      return Response.json({ success: true });
    }

    if (action === "deactivate") {
      if (!["HEAD_OF_UNIT", "ADMIN"].includes(role)) {
        return Response.json({ error: "Only HEAD_OF_UNIT or ADMIN can deactivate users." }, { status: 403 });
      }
      const user = await db.user.update({
        where: { id: userId },
        data: { approved: false, deactivated: true },
      });
      return Response.json(user);
    }

    if (action === "reactivate") {
      if (!["HEAD_OF_UNIT", "ADMIN"].includes(role)) {
        return Response.json({ error: "Only HEAD_OF_UNIT or ADMIN can reactivate users." }, { status: 403 });
      }
      const user = await db.user.update({
        where: { id: userId },
        data: { approved: true, deactivated: false },
      });
      return Response.json(user);
    }

    if (action === "reset_password") {
      if (!["HEAD_OF_UNIT", "ADMIN"].includes(role)) {
        return Response.json({ error: "Only HEAD_OF_UNIT or ADMIN can reset passwords." }, { status: 403 });
      }
      const { newPassword } = body;
      if (!newPassword || newPassword.length < 8) {
        return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      await db.user.update({
        where: { id: userId },
        data: { password: hashed },
      });
      return Response.json({ success: true });
    }

    return Response.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}