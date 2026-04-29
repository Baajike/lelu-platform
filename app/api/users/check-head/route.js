import { db } from "../../../lib/db";

export async function GET() {
  try {
    const head = await db.user.findFirst({
      where: { role: "HEAD_OF_UNIT", approved: true },
      select: { id: true },
    });
    return Response.json({ headExists: !!head });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
