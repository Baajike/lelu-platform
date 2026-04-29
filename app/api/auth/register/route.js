import { db } from "../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return Response.json({ error: "All fields are required." }, { status: 400 });
    }

    if (role === "ADMIN") {
      return Response.json({ error: "Forbidden." }, { status: 403 });
    }

    // Only HEAD_OF_UNIT is allowed as a non-officer registration; everything else becomes OFFICER
    const assignedRole = role === "HEAD_OF_UNIT" ? "HEAD_OF_UNIT" : "OFFICER";

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    let autoApprove = false;

    if (assignedRole === "HEAD_OF_UNIT") {
      const existingHead = await db.user.findFirst({
        where: { role: "HEAD_OF_UNIT", approved: true },
        select: { id: true },
      });
      if (existingHead) {
        return Response.json({ error: "A Head of Unit account already exists." }, { status: 400 });
      }
      // First Head of Unit — auto-approve so they can log in immediately
      autoApprove = true;
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: assignedRole,
        approved: autoApprove,
      },
    });

    return Response.json({ success: true, id: user.id, autoApproved: autoApprove }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
