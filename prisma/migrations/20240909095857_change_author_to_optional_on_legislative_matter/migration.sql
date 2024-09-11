-- DropForeignKey
ALTER TABLE "LegislativeMatter" DROP CONSTRAINT "LegislativeMatter_authorId_fkey";

-- AlterTable
ALTER TABLE "LegislativeMatter" ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LegislativeMatter" ADD CONSTRAINT "LegislativeMatter_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
