import { db } from "../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const HEAD_ROLES = ["HEAD_OF_UNIT", "ADMIN"];

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { reqId } = await params;
    const body = await request.json();

    const req = await db.internationalRequest.findUnique({ where: { id: reqId }, select: { officerId: true } });
    if (!req) return Response.json({ error: "Not found." }, { status: 404 });
    if (!HEAD_ROLES.includes(session.user.role) && req.officerId !== session.user.id) {
      return Response.json({ error: "Forbidden." }, { status: 403 });
    }

    const { status, respondedAt, attachmentPath, attachmentName } = body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (respondedAt !== undefined) updateData.respondedAt = new Date(respondedAt);
    if (attachmentPath !== undefined) updateData.attachmentPath = attachmentPath;
    if (attachmentName !== undefined) updateData.attachmentName = attachmentName;

    const updated = await db.internationalRequest.update({
      where: { id: reqId },
      data: updateData,
    });

    return Response.json(updated);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { reqId } = await params;

    const req = await db.internationalRequest.findUnique({ where: { id: reqId }, select: { officerId: true } });
    if (!req) return Response.json({ error: "Not found." }, { status: 404 });
    if (!HEAD_ROLES.includes(session.user.role) && req.officerId !== session.user.id) {
      return Response.json({ error: "Forbidden." }, { status: 403 });
    }

    await db.internationalRequest.delete({ where: { id: reqId } });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
