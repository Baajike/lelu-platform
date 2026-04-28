-- AlterTable
ALTER TABLE "CdrRequest" DROP CONSTRAINT "CdrRequest_caseId_fkey";
ALTER TABLE "CdrRequest" ALTER COLUMN "caseId" DROP NOT NULL;
ALTER TABLE "CdrRequest" ADD CONSTRAINT "CdrRequest_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
