-- AlterTable
ALTER TABLE "users" ADD COLUMN     "sessionAbsentId" TEXT,
ADD COLUMN     "sessionPresentId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_sessionAbsentId_fkey" FOREIGN KEY ("sessionAbsentId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_sessionPresentId_fkey" FOREIGN KEY ("sessionPresentId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
