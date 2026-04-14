import { db } from "../../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const role = session.user.role;
    if (!["HEAD_OF_UNIT", "OFFICE_ADMINISTRATOR", "ADMIN"].includes(role)) {
      return Response.json({ error: "Insufficient permissions." }, { status: 403 });
    }

    const { userId } = await params;
    const { action } = await request.json();

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

    return Response.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}