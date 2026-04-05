-- CreateTable
CREATE TABLE "MoveRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "moveDate" DATETIME NOT NULL,
    "homeSize" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "budget" INTEGER,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "quoteAmount" INTEGER,
    "adminNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "MoveRequest_status_idx" ON "MoveRequest"("status");

-- CreateIndex
CREATE INDEX "MoveRequest_moveDate_idx" ON "MoveRequest"("moveDate");

-- CreateIndex
CREATE INDEX "MoveRequest_createdAt_idx" ON "MoveRequest"("createdAt");
