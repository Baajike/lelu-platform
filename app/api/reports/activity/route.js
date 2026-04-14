import { db } from "../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const reports = await db.activityReport.findMany({
      include: { officer: { select: { name: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(reports);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { weekStart, weekEnd, summary, casesWorked, challenges, nextSteps } = body;

    const report = await db.activityReport.create({
      data: {
        weekStart: new Date(weekStart),
        weekEnd: new Date(weekEnd),
        summary,
        casesWorked,
        challenges,
        nextSteps,
        officerId: session.user.id,
      },
      include: { officer: { select: { name: true, role: true } } },
    });

    return Response.json(report, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}