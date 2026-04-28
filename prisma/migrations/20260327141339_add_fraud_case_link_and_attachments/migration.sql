-- AlterTable
ALTER TABLE "CdrRequest" ADD COLUMN "attachmentName" TEXT;
ALTER TABLE "CdrRequest" ADD COLUMN "attachmentPath" TEXT;

-- AlterTable
ALTER TABLE "InternationalRequest" ADD COLUMN "attachmentName" TEXT;
ALTER TABLE "InternationalRequest" ADD COLUMN "attachmentPath" TEXT;

-- AlterTable
ALTER TABLE "FraudEntity" ADD COLUMN "caseId" TEXT;
ALTER TABLE "FraudEntity" ADD CONSTRAINT "FraudEntity_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
