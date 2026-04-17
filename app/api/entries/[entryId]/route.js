import { db } from "../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const HEAD_ROLES = ["HEAD_OF_UNIT", "ADMIN"];

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { entryId } = await params;
    const body = await request.json();

    const entry = await db.journalEntry.findUnique({
      where: { id: entryId },
      select: { authorId: true },
    });
    if (!entry) return Response.json({ error: "Entry not found." }, { status: 404 });
    if (!HEAD_ROLES.includes(session.user.role) && entry.authorId !== session.user.id) {
      return Response.json({ error: "Forbidden." }, { status: 403 });
    }

    const updated = await db.journalEntry.update({
      where: { id: entryId },
      data: { content: body.content },
      include: { author: { select: { name: true } } },
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

    const { entryId } = await params;

    const entry = await db.journalEntry.findUnique({
      where: { id: entryId },
      select: { authorId: true },
    });
    if (!entry) return Response.json({ error: "Entry not found." }, { status: 404 });
    if (!HEAD_ROLES.includes(session.user.role) && entry.authorId !== session.user.id) {
      return Response.json({ error: "Forbidden." }, { status: 403 });
    }

    await db.journalEntry.delete({
      where: { id: entryId },
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}