-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OFFICER',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "description" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    "closedAt" TIMESTAMP,
    "closureReason" TEXT,
    "officerId" TEXT NOT NULL,
    CONSTRAINT "Case_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Case_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "actions" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "caseId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "JournalEntry_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JournalEntry_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CdrRequest" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "telco" TEXT NOT NULL,
    "periodStart" TIMESTAMP NOT NULL,
    "periodEnd" TIMESTAMP NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "requestedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receivedAt" TIMESTAMP,
    "caseId" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    CONSTRAINT "CdrRequest_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CdrRequest_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CdrRequest_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FraudEntity" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    CONSTRAINT "FraudEntity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Case_caseNumber_key" ON "Case"("caseNumber");
