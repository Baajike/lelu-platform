const { PrismaClient } = require("../app/generated/prisma");

const db = new PrismaClient();

async function main() {
  console.log("Database ready - no seed users created.");
}

main().catch(console.error).finally(() => db.$disconnect());
