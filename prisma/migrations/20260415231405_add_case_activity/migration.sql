-- CreateTable
CREATE TABLE "CaseActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "userId" TEXT,
    "userName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CaseActivity_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActivityReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekStart" DATETIME NOT NULL,
    "weekEnd" DATETIME NOT NULL,
    "summary" TEXT NOT NULL,
    "casesWorked" TEXT,
    "challenges" TEXT,
    "nextSteps" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Submitted',
    "officerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityReport_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ActivityReport" ("casesWorked", "challenges", "createdAt", "id", "nextSteps", "officerId", "status", "summary", "weekEnd", "weekStart") SELECT "casesWorked", "challenges", "createdAt", "id", "nextSteps", "officerId", "status", "summary", "weekEnd", "weekStart" FROM "ActivityReport";
DROP TABLE "ActivityReport";
ALTER TABLE "new_ActivityReport" RENAME TO "ActivityReport";
CREATE TABLE "new_Case" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "closedAt" DATETIME,
    "closureReason" TEXT,
    "officerId" TEXT,
    CONSTRAINT "Case_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Case" ("caseNumber", "category", "closedAt", "closureReason", "createdAt", "description", "id", "officerId", "status", "title", "updatedAt") SELECT "caseNumber", "category", "closedAt", "closureReason", "createdAt", "description", "id", "officerId", "status", "title", "updatedAt" FROM "Case";
DROP TABLE "Case";
ALTER TABLE "new_Case" RENAME TO "Case";
CREATE UNIQUE INDEX "Case_caseNumber_key" ON "Case"("caseNumber");
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
    "officerId" TEXT,
    "attachmentPath" TEXT,
    "attachmentName" TEXT,
    CONSTRAINT "CdrRequest_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "CdrRequest_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CdrRequest" ("attachmentName", "attachmentPath", "caseId", "id", "officerId", "periodEnd", "periodStart", "phoneNumber", "reason", "receivedAt", "requestedAt", "status", "telco") SELECT "attachmentName", "attachmentPath", "caseId", "id", "officerId", "periodEnd", "periodStart", "phoneNumber", "reason", "receivedAt", "requestedAt", "status", "telco" FROM "CdrRequest";
DROP TABLE "CdrRequest";
ALTER TABLE "new_CdrRequest" RENAME TO "CdrRequest";
CREATE TABLE "new_InternationalRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "refNumber" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "agency" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "details" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "caseId" TEXT,
    "officerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" DATETIME,
    "attachmentPath" TEXT,
    "attachmentName" TEXT,
    CONSTRAINT "InternationalRequest_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InternationalRequest_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_InternationalRequest" ("agency", "attachmentName", "attachmentPath", "caseId", "country", "createdAt", "details", "direction", "id", "officerId", "priority", "refNumber", "respondedAt", "status", "subject") SELECT "agency", "attachmentName", "attachmentPath", "caseId", "country", "createdAt", "details", "direction", "id", "officerId", "priority", "refNumber", "respondedAt", "status", "subject" FROM "InternationalRequest";
DROP TABLE "InternationalRequest";
ALTER TABLE "new_InternationalRequest" RENAME TO "InternationalRequest";
CREATE UNIQUE INDEX "InternationalRequest_refNumber_key" ON "InternationalRequest"("refNumber");
CREATE TABLE "new_JournalEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayNumber" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "actions" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "caseId" TEXT NOT NULL,
    "authorId" TEXT,
    CONSTRAINT "JournalEntry_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JournalEntry_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_JournalEntry" ("actions", "authorId", "caseId", "content", "createdAt", "dayNumber", "id") SELECT "actions", "authorId", "caseId", "content", "createdAt", "dayNumber", "id" FROM "JournalEntry";
DROP TABLE "JournalEntry";
ALTER TABLE "new_JournalEntry" RENAME TO "JournalEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
