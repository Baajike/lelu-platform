-- CreateTable
CREATE TABLE "CaseActivity" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "userId" TEXT,
    "userName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CaseActivity_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CaseActivity_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- AlterTable
ALTER TABLE "ActivityReport" DROP CONSTRAINT "ActivityReport_officerId_fkey";
ALTER TABLE "ActivityReport" ALTER COLUMN "officerId" DROP NOT NULL;
ALTER TABLE "ActivityReport" ADD CONSTRAINT "ActivityReport_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Case" DROP CONSTRAINT "Case_officerId_fkey";
ALTER TABLE "Case" ALTER COLUMN "officerId" DROP NOT NULL;
ALTER TABLE "Case" ADD CONSTRAINT "Case_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "CdrRequest" DROP CONSTRAINT "CdrRequest_officerId_fkey";
ALTER TABLE "CdrRequest" ALTER COLUMN "officerId" DROP NOT NULL;
ALTER TABLE "CdrRequest" ADD CONSTRAINT "CdrRequest_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "InternationalRequest" DROP CONSTRAINT "InternationalRequest_officerId_fkey";
ALTER TABLE "InternationalRequest" ALTER COLUMN "officerId" DROP NOT NULL;
ALTER TABLE "InternationalRequest" ADD CONSTRAINT "InternationalRequest_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "JournalEntry" DROP CONSTRAINT "JournalEntry_authorId_fkey";
ALTER TABLE "JournalEntry" ALTER COLUMN "authorId" DROP NOT NULL;
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
