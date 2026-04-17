import { db } from "../../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

const HEAD_ROLES = ["HEAD_OF_UNIT", "ADMIN"];

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const assignments = await db.caseAssignment.findMany({
      where: { caseId: id },
      include: {
        user: { select: { id: true, name: true, role: true, email: true } },
      },
      orderBy: { assignedAt: "asc" },
    });

    return Response.json(assignments);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { userId } = await request.json();

    if (!userId) return Response.json({ error: "userId is required." }, { status: 400 });

    // Fetch case for authorization + notification message
    const caseData = await db.case.findUnique({
      where: { id },
      select: { id: true, caseNumber: true, title: true, officerId: true },
    });
    if (!caseData) return Response.json({ error: "Case not found." }, { status: 404 });

    // Officers can only invite to their own cases; HEAD_OF_UNIT/ADMIN can invite to any
    if (!HEAD_ROLES.includes(session.user.role)) {
      if (caseData.officerId !== session.user.id) {
        return Response.json({ error: "You can only invite people to your own cases." }, { status: 403 });
      }
    }

    // Check for existing non-declined assignment
    const existing = await db.caseAssignment.findUnique({
      where: { caseId_userId: { caseId: id, userId } },
    });
    if (existing && existing.status !== "Declined") {
      return Response.json({ error: "This officer already has a pending or accepted invitation." }, { status: 409 });
    }

    const targetUser = await db.user.findUnique({ where: { id: userId }, select: { name: true } });
    if (!targetUser) return Response.json({ error: "User not found." }, { status: 404 });

    // Upsert: if previously declined, update to Pending; otherwise create
    let assignment;
    if (existing && existing.status === "Declined") {
      assignment = await db.caseAssignment.update({
        where: { id: existing.id },
        data: { status: "Pending", assignedBy: session.user.id, assignedAt: new Date() },
        include: { user: { select: { id: true, name: true, role: true, email: true } } },
      });
    } else {
      assignment = await db.caseAssignment.create({
        data: { caseId: id, userId, assignedBy: session.user.id, status: "Pending" },
        include: { user: { select: { id: true, name: true, role: true, email: true } } },
      });
    }

    // Create notification for the invited user
    await db.notification.create({
      data: {
        userId,
        type: "CASE_INVITATION",
        title: "Case Invitation",
        message: `${session.user.name} has invited you to work on ${caseData.caseNumber} — ${caseData.title}`,
        link: `/dashboard/cases/${id}`,
        meta: JSON.stringify({ assignmentId: assignment.id, caseId: id }),
      },
    }).catch(() => {});

    // Activity log
    await db.caseActivity.create({
      data: {
        caseId: id,
        userId: session.user.id,
        userName: session.user.name,
        action: "Officer invited to case",
        detail: targetUser.name,
      },
    }).catch(() => {});

    return Response.json(assignment, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id: caseId } = await params;
    const { assignmentId, action } = await request.json();

    if (!assignmentId || !["accept", "decline"].includes(action)) {
      return Response.json({ error: "assignmentId and action ('accept' or 'decline') are required." }, { status: 400 });
    }

    const assignment = await db.caseAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) return Response.json({ error: "Assignment not found." }, { status: 404 });
    if (assignment.userId !== session.user.id) {
      return Response.json({ error: "You can only respond to your own invitations." }, { status: 403 });
    }
    if (assignment.status !== "Pending") {
      return Response.json({ error: "This invitation has already been responded to." }, { status: 409 });
    }

    const newStatus = action === "accept" ? "Accepted" : "Declined";

    const updated = await db.caseAssignment.update({
      where: { id: assignmentId },
      data: { status: newStatus },
    });

    // Mark the related notification as read
    await db.notification.updateMany({
      where: {
        userId: session.user.id,
        type: "CASE_INVITATION",
        meta: { contains: assignmentId },
      },
      data: { read: true },
    }).catch(() => {});

    // Activity log
    await db.caseActivity.create({
      data: {
        caseId: assignment.caseId,
        userId: session.user.id,
        userName: session.user.name,
        action: action === "accept" ? "Officer accepted case invitation" : "Officer declined case invitation",
        detail: null,
      },
    }).catch(() => {});

    return Response.json(updated);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { userId } = await request.json();

    if (!userId) return Response.json({ error: "userId is required." }, { status: 400 });

    // Only case owner or HEAD_OF_UNIT/ADMIN can remove
    if (!HEAD_ROLES.includes(session.user.role)) {
      const caseData = await db.case.findUnique({ where: { id }, select: { officerId: true } });
      if (!caseData) return Response.json({ error: "Case not found." }, { status: 404 });
      if (caseData.officerId !== session.user.id) {
        return Response.json({ error: "Only the case owner or Head of Unit can remove officers." }, { status: 403 });
      }
    }

    const targetUser = await db.user.findUnique({ where: { id: userId }, select: { name: true } });

    await db.caseAssignment.deleteMany({ where: { caseId: id, userId } });

    // Clean up any pending notifications for this user about this case
    await db.notification.updateMany({
      where: {
        userId,
        type: "CASE_INVITATION",
        meta: { contains: id },
        read: false,
      },
      data: { read: true },
    }).catch(() => {});

    // Activity log
    await db.caseActivity.create({
      data: {
        caseId: id,
        userId: session.user.id,
        userName: session.user.name,
        action: "Officer removed from case",
        detail: targetUser?.name || userId,
      },
    }).catch(() => {});

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
