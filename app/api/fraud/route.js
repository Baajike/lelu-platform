import { db } from "../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";

    const entities = await db.fraudEntity.findMany({
      where: {
        AND: [
          type ? { type } : {},
          search ? {
            OR: [
              { value: { contains: search } },
              { notes: { contains: search } },
              { category: { contains: search } },
            ]
          } : {}
        ]
      },
      include: { case: { select: { id: true, caseNumber: true, title: true } } },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(entities);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { type, value, category, notes, caseId } = body;

    const entity = await db.fraudEntity.create({
      data: { type, value, category, notes, caseId: caseId || null },
      include: { case: { select: { id: true, caseNumber: true, title: true } } },
    });

    return Response.json(entity, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}