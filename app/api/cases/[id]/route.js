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
        officer: { select: { id: true, name: true, email: true } },
        entries: {
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: "asc" },
        },
        cdrRequests: true,
        caseActivities: { orderBy: { createdAt: "desc" } },
        caseAssignments: {
          include: { user: { select: { id: true, name: true, role: true, email: true } } },
          orderBy: { assignedAt: "asc" },
        },
      },
    });

    if (!caseData) return Response.json({ error: "Case not found" }, { status: 404 });

    upsertViewer(id, session.user.id, session.user.name);

    // ── Case Correlation ──────────────────────────────────────────────────
    let relatedCases = [];
    try {
      // Normalise text: collapse digit-space-digit to remove phone formatting
      const rawText = caseData.entries
        .map(e => [e.content, e.actions || ""].join(" "))
        .join(" ");
      const normText = rawText.replace(/(\d)[\s\-]+(\d)/g, "$1$2");

      // Ghanaian phone numbers: 0[2-9]XXXXXXXX (10 digits)
      const phoneRE = /\b0[2-9]\d{8}\b/g;
      const emailRE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;

      const extractedPhones = [...new Set(normText.match(phoneRE) || [])];
      const extractedEmails = [...new Set((rawText.match(emailRE) || []).map(e => e.toLowerCase()))];

      // Identifiers from CDR requests on this case
      const cdrTerms = caseData.cdrRequests.map(r =>
        r.phoneNumber.replace(/[\s\-]/g, "").toLowerCase()
      );

      const phoneTerms = [...new Set([...extractedPhones, ...cdrTerms])].filter(p => p.length >= 8);
      const emailTerms = [...new Set(extractedEmails)];

      if (phoneTerms.length > 0 || emailTerms.length > 0) {
        // Fetch other cases' entries and CDR requests in parallel
        const [otherEntries, otherCdrs] = await Promise.all([
          db.journalEntry.findMany({
            where: { caseId: { not: id } },
            select: {
              content: true, actions: true,
              case: {
                select: {
                  id: true, caseNumber: true, title: true, status: true,
                  officer: { select: { name: true } },
                },
              },
            },
          }),
          db.cdrRequest.findMany({
            where: { AND: [{ NOT: { caseId: null } }, { caseId: { not: id } }] },
            select: {
              phoneNumber: true, identifierType: true, caseId: true,
              case: {
                select: {
                  id: true, caseNumber: true, title: true, status: true,
                  officer: { select: { name: true } },
                },
              },
            },
          }),
        ]);

        // Map: caseId → { case, reasons }
        const related = new Map();
        const addMatch = (c, reason) => {
          if (!c || c.id === id) return;
          if (!related.has(c.id)) related.set(c.id, { case: c, reasons: new Set() });
          related.get(c.id).reasons.add(reason);
        };

        // Match against other journal entries
        for (const entry of otherEntries) {
          if (!entry.case || entry.case.id === id) continue;
          const text = [entry.content, entry.actions || ""]
            .join(" ")
            .replace(/(\d)[\s\-]+(\d)/g, "$1$2");

          for (const phone of phoneTerms) {
            if (text.includes(phone))
              addMatch(entry.case, `Identifier ${phone} also mentioned in journal entries`);
          }
          for (const email of emailTerms) {
            if (text.toLowerCase().includes(email))
              addMatch(entry.case, `Email address ${email} also mentioned in journal entries`);
          }
        }

        // Match against other CDR requests
        for (const cdr of otherCdrs) {
          if (!cdr.case || cdr.caseId === id) continue;
          const cdrVal = cdr.phoneNumber.replace(/[\s\-]/g, "").toLowerCase();
          for (const phone of phoneTerms) {
            if (cdrVal === phone)
              addMatch(cdr.case, `Identifier ${phone} has a CDR/intelligence request in this case`);
          }
        }

        relatedCases = [...related.values()].map(({ case: c, reasons }) => ({
          caseId: c.id,
          caseNumber: c.caseNumber,
          title: c.title,
          status: c.status,
          officerName: c.officer?.name || "—",
          matchReason: [...reasons][0],
          matchCount: reasons.size,
        }));
      }
    } catch (e) {
      console.error("Correlation error:", e);
    }

    return Response.json({ ...caseData, relatedCases });
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

    const existingCase = await db.case.findUnique({
      where: { id },
      select: {
        officerId: true,
        caseAssignments: {
          where: { userId: session.user.id, status: "Accepted" },
          select: { id: true },
        },
      },
    });
    if (!existingCase) return Response.json({ error: "Case not found." }, { status: 404 });

    const HEAD_ROLES = ["HEAD_OF_UNIT", "ADMIN"];
    const isAuthorized =
      HEAD_ROLES.includes(session.user.role) ||
      existingCase.officerId === session.user.id ||
      existingCase.caseAssignments.length > 0;
    if (!isAuthorized) return Response.json({ error: "Forbidden." }, { status: 403 });

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