import { db } from "../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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
      },
    });

    if (!caseData) return Response.json({ error: "Case not found" }, { status: 404 });
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

    return Response.json(updated);
  } catch (error) {
    console.error("PATCH case error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}