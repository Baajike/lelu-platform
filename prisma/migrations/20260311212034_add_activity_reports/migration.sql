-- CreateTable
CREATE TABLE "ActivityReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekStart" DATETIME NOT NULL,
    "weekEnd" DATETIME NOT NULL,
    "summary" TEXT NOT NULL,
    "casesWorked" TEXT,
    "challenges" TEXT,
    "nextSteps" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Submitted',
    "officerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityReport_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
