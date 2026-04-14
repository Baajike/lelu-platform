const { PrismaClient } = require("../app/generated/prisma");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("lelu2026", 10);

  const users = [
    { name: "Head of Unit", email: "head@lelu.gov.gh", role: "HEAD_OF_UNIT" },
    { name: "Admin Officer", email: "admin@lelu.gov.gh", role: "OFFICE_ADMINISTRATOR" },
    { name: "Supervisor Mensah", email: "supervisor@lelu.gov.gh", role: "SUPERVISOR" },
    { name: "Officer Asante", email: "asante@lelu.gov.gh", role: "OFFICER" },
    { name: "Officer Boateng", email: "boateng@lelu.gov.gh", role: "OFFICER" },
    { name: "Officer Darko", email: "darko@lelu.gov.gh", role: "OFFICER" },
  ];

  for (const u of users) {
    await db.user.upsert({
      where: { email: u.email },
      update: { role: u.role, approved: true },
      create: { ...u, password, approved: true },
    });
  }

  console.log("✅ Seeded 6 approved LELU users");
}

main().catch(console.error).finally(() => db.$disconnect());