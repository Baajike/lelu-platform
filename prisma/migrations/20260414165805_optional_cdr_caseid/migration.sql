-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CdrRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phoneNumber" TEXT NOT NULL,
    "telco" TEXT NOT NULL,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "requestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receivedAt" DATETIME,
    "caseId" TEXT,
    "officerId" TEXT NOT NULL,
    "attachmentPath" TEXT,
    "attachmentName" TEXT,
    CONSTRAINT "CdrRequest_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CdrRequest_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CdrRequest" ("id", "phoneNumber", "telco", "periodStart", "periodEnd", "reason", "status", "requestedAt", "receivedAt", "caseId", "officerId", "attachmentPath", "attachmentName") SELECT "id", "phoneNumber", "telco", "periodStart", "periodEnd", "reason", "status", "requestedAt", "receivedAt", "caseId", "officerId", "attachmentPath", "attachmentName" FROM "CdrRequest";
DROP TABLE "CdrRequest";
ALTER TABLE "new_CdrRequest" RENAME TO "CdrRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
