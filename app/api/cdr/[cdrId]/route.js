import { db } from "../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const HEAD_ROLES = ["HEAD_OF_UNIT", "ADMIN"];

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { cdrId } = await params;
    const body = await request.json();

    const cdr = await db.cdrRequest.findUnique({ where: { id: cdrId }, select: { officerId: true } });
    if (!cdr) return Response.json({ error: "Not found." }, { status: 404 });
    if (!HEAD_ROLES.includes(session.user.role) && cdr.officerId !== session.user.id) {
      return Response.json({ error: "Forbidden." }, { status: 403 });
    }

    const { status, receivedAt, attachmentPath, attachmentName } = body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (receivedAt !== undefined) updateData.receivedAt = new Date(receivedAt);
    if (attachmentPath !== undefined) updateData.attachmentPath = attachmentPath;
    if (attachmentName !== undefined) updateData.attachmentName = attachmentName;

    const updated = await db.cdrRequest.update({
      where: { id: cdrId },
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

    const { cdrId } = await params;

    const cdr = await db.cdrRequest.findUnique({ where: { id: cdrId }, select: { officerId: true } });
    if (!cdr) return Response.json({ error: "Not found." }, { status: 404 });
    if (!HEAD_ROLES.includes(session.user.role) && cdr.officerId !== session.user.id) {
      return Response.json({ error: "Forbidden." }, { status: 403 });
    }

    await db.cdrRequest.delete({ where: { id: cdrId } });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
