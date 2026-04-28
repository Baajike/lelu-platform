-- CreateTable
CREATE TABLE "InternationalRequest" (
    "id" TEXT NOT NULL,
    "refNumber" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "agency" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "details" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "caseId" TEXT,
    "officerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP,
    CONSTRAINT "InternationalRequest_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "InternationalRequest_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InternationalRequest_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "InternationalRequest_refNumber_key" ON "InternationalRequest"("refNumber");
