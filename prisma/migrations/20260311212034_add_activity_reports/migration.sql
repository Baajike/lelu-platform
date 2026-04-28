-- CreateTable
CREATE TABLE "ActivityReport" (
    "id" TEXT NOT NULL,
    "weekStart" TIMESTAMP NOT NULL,
    "weekEnd" TIMESTAMP NOT NULL,
    "summary" TEXT NOT NULL,
    "casesWorked" TEXT,
    "challenges" TEXT,
    "nextSteps" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Submitted',
    "officerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityReport_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ActivityReport_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
