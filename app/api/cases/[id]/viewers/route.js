import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getViewers, removeViewer, upsertViewer } from "../../../../lib/viewerStore";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Keep-alive: refresh this user's timestamp so they stay registered while polling
    upsertViewer(id, session.user.id, session.user.name);

    const viewers = getViewers(id).filter(v => v.userId !== session.user.id);
    return Response.json(viewers);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    removeViewer(id, session.user.id);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
