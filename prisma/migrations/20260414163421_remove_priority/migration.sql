-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "officerId" TEXT NOT NULL,
    CONSTRAINT "Case_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Case" ("id", "caseNumber", "title", "category", "status", "description", "createdAt", "updatedAt", "closedAt", "closureReason", "officerId") SELECT "id", "caseNumber", "title", "category", "status", "description", "createdAt", "updatedAt", "closedAt", "closureReason", "officerId" FROM "Case";
DROP TABLE "Case";
ALTER TABLE "new_Case" RENAME TO "Case";
CREATE UNIQUE INDEX "Case_caseNumber_key" ON "Case"("caseNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
