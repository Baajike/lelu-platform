-- AlterTable
ALTER TABLE "CdrRequest" ADD COLUMN "attachmentName" TEXT;
ALTER TABLE "CdrRequest" ADD COLUMN "attachmentPath" TEXT;

-- AlterTable
ALTER TABLE "InternationalRequest" ADD COLUMN "attachmentName" TEXT;
ALTER TABLE "InternationalRequest" ADD COLUMN "attachmentPath" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FraudEntity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "caseId" TEXT,
    CONSTRAINT "FraudEntity_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FraudEntity" ("category", "createdAt", "id", "notes", "type", "updatedAt", "value") SELECT "category", "createdAt", "id", "notes", "type", "updatedAt", "value" FROM "FraudEntity";
DROP TABLE "FraudEntity";
ALTER TABLE "new_FraudEntity" RENAME TO "FraudEntity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
