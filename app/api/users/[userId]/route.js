import { db } from "../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "HEAD_OF_UNIT") {
      return Response.json({ error: "Only HEAD_OF_UNIT can delete users." }, { status: 403 });
    }

    const { userId } = await params;

    if (userId === session.user.id) {
      return Response.json({ error: "Cannot delete your own account." }, { status: 400 });
    }

    // Nullify FK references so all case data, entries, and requests are preserved
    await db.case.updateMany({ where: { officerId: userId }, data: { officerId: null } });
    await db.journalEntry.updateMany({ where: { authorId: userId }, data: { authorId: null } });
    await db.cdrRequest.updateMany({ where: { officerId: userId }, data: { officerId: null } });
    await db.internationalRequest.updateMany({ where: { officerId: userId }, data: { officerId: null } });
    await db.activityReport.updateMany({ where: { officerId: userId }, data: { officerId: null } });

    await db.user.delete({ where: { id: userId } });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
