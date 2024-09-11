-- AlterTable
ALTER TABLE "LegislativeMatter" ADD COLUMN     "cityCouncilId" TEXT;

-- AddForeignKey
ALTER TABLE "LegislativeMatter" ADD CONSTRAINT "LegislativeMatter_cityCouncilId_fkey" FOREIGN KEY ("cityCouncilId") REFERENCES "city_council"("id") ON DELETE SET NULL ON UPDATE CASCADE;
