import { db } from "../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { upsertViewer } from "../../../lib/viewerStore";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const caseData = await db.case.findUnique({
      where: { id },
      include: {
        officer: { select: { name: true, email: true } },
        entries: {
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: "asc" },
        },
        cdrRequests: true,
        caseActivities: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!caseData) return Response.json({ error: "Case not found" }, { status: 404 });

    upsertViewer(id, session.user.id, session.user.name);

    return Response.json(caseData);
  } catch (error) {
    console.error("GET case error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    const updated = await db.case.update({
      where: { id },
      data: body,
    });

    let activityAction = null;
    if (body.status === "Closed") activityAction = "Case closed";
    else if (body.status === "Declined") activityAction = "Case declined";
    else if (body.status === "Active") activityAction = "Case reopened";

    if (activityAction) {
      await db.caseActivity.create({
        data: {
          caseId: id,
          userId: session.user.id,
          userName: session.user.name,
          action: activityAction,
          detail: body.closureReason || null,
        },
      }).catch(() => {});
    }

    return Response.json(updated);
  } catch (error) {
    console.error("PATCH case error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}