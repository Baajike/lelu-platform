import { db } from "../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return Response.json({ error: "All fields are required." }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashed,
        role,
        approved: false,
      },
    });

    return Response.json({ success: true, id: user.id }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}