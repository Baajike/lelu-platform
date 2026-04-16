import { db } from "../../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { content, actions } = body;

    const existingEntries = await db.journalEntry.count({
      where: { caseId: id },
    });

    const entry = await db.journalEntry.create({
      data: {
        content,
        actions: actions || "",
        dayNumber: existingEntries + 1,
        caseId: id,
        authorId: session.user.id,
      },
      include: { author: { select: { name: true } } },
    });

    await db.caseActivity.create({
      data: {
        caseId: id,
        userId: session.user.id,
        userName: session.user.name,
        action: "Journal entry added",
        detail: `Input ${entry.dayNumber}`,
      },
    }).catch(() => {});

    return Response.json(entry, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}