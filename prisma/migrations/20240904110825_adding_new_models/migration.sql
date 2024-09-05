-- CreateEnum
CREATE TYPE "SessionTypes" AS ENUM ('ORDINARY');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('SCHEDULED', 'STARTED', 'SUSPENDED', 'POSTPONED', 'CLOSED', 'CANCELED');

-- CreateEnum
CREATE TYPE "VotingType" AS ENUM ('SECRET', 'NOMINAL');

-- CreateEnum
CREATE TYPE "LegislativeMatterStatus" AS ENUM ('PUBLISHED', 'DISCUSSED', 'VOTED_ON', 'ADOPTED', 'REJECTED', 'POSTPONED', 'WITHDRAW');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "legislativeMatterId" TEXT;

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "legislature" TEXT NOT NULL,
    "legislativeSession" TEXT NOT NULL,
    "type" "SessionTypes" NOT NULL,
    "numberSession" INTEGER NOT NULL,
    "openingDateTime" TIMESTAMP(3) NOT NULL,
    "closingDateTime" TIMESTAMP(3) NOT NULL,
    "sessionStatus" "SessionStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "cityCouncilId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderDay" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "OrderDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Office" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegislativeMatter" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "presentationDate" TIMESTAMP(3) NOT NULL,
    "code" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "votingType" "VotingType" NOT NULL,
    "status" "LegislativeMatterStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "officeId" TEXT,
    "orderDayId" TEXT,
    "sessionId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "LegislativeMatter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderDay_sessionId_key" ON "OrderDay"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Office_sessionId_key" ON "Office"("sessionId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_legislativeMatterId_fkey" FOREIGN KEY ("legislativeMatterId") REFERENCES "LegislativeMatter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_cityCouncilId_fkey" FOREIGN KEY ("cityCouncilId") REFERENCES "city_council"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderDay" ADD CONSTRAINT "OrderDay_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Office" ADD CONSTRAINT "Office_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegislativeMatter" ADD CONSTRAINT "LegislativeMatter_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegislativeMatter" ADD CONSTRAINT "LegislativeMatter_orderDayId_fkey" FOREIGN KEY ("orderDayId") REFERENCES "OrderDay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegislativeMatter" ADD CONSTRAINT "LegislativeMatter_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegislativeMatter" ADD CONSTRAINT "LegislativeMatter_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
