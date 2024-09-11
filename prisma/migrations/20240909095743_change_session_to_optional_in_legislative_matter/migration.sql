-- DropForeignKey
ALTER TABLE "LegislativeMatter" DROP CONSTRAINT "LegislativeMatter_sessionId_fkey";

-- AlterTable
ALTER TABLE "LegislativeMatter" ALTER COLUMN "sessionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LegislativeMatter" ADD CONSTRAINT "LegislativeMatter_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
