import { db } from "../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 3) {
      return Response.json({ cdrs: [], cases: [], entries: [], intel: [] });
    }

    const [cdrs, cases, entries, intel] = await Promise.all([
      db.cdrRequest.findMany({
        where: { phoneNumber: { contains: q } },
        include: {
          case:    { select: { id: true, caseNumber: true, title: true } },
          officer: { select: { id: true, name: true } },
        },
        orderBy: { requestedAt: "desc" },
        take: 10,
      }),
      db.case.findMany({
        where: {
          OR: [
            { title:       { contains: q } },
            { description: { contains: q } },
          ],
        },
        include: { officer: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      db.journalEntry.findMany({
        where: {
          OR: [
            { content: { contains: q } },
            { actions: { contains: q } },
          ],
        },
        include: {
          case:   { select: { id: true, caseNumber: true, title: true } },
          author: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      db.internationalRequest.findMany({
        where: {
          OR: [
            { subject: { contains: q } },
            { details: { contains: q } },
          ],
        },
        include: { case: { select: { id: true, caseNumber: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return Response.json({ cdrs, cases, entries, intel });
  } catch (error) {
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
