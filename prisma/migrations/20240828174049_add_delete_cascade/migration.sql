-- DropForeignKey
ALTER TABLE "Responsible" DROP CONSTRAINT "Responsible_cityCouncilId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_affiliatedCouncilId_fkey";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_affiliatedCouncilId_fkey" FOREIGN KEY ("affiliatedCouncilId") REFERENCES "city_council"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responsible" ADD CONSTRAINT "Responsible_cityCouncilId_fkey" FOREIGN KEY ("cityCouncilId") REFERENCES "city_council"("id") ON DELETE CASCADE ON UPDATE CASCADE;
