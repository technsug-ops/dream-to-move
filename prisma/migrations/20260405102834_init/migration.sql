-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "HomeSize" AS ENUM ('STUDIO', 'ONE_PLUS_ONE', 'TWO_PLUS_ONE', 'THREE_PLUS_ONE', 'FOUR_PLUS_ONE_PLUS');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('ONLY_TRANSPORT', 'PACKING_AND_TRANSPORT', 'FULL_SERVICE');

-- CreateTable
CREATE TABLE "MoveRequest" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "moveDate" TIMESTAMP(3) NOT NULL,
    "homeSize" "HomeSize" NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "budget" INTEGER,
    "note" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'NEW',
    "quoteAmount" INTEGER,
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MoveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MoveRequest_status_idx" ON "MoveRequest"("status");

-- CreateIndex
CREATE INDEX "MoveRequest_moveDate_idx" ON "MoveRequest"("moveDate");

-- CreateIndex
CREATE INDEX "MoveRequest_createdAt_idx" ON "MoveRequest"("createdAt");
