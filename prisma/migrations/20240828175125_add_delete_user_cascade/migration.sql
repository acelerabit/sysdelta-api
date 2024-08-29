-- DropForeignKey
ALTER TABLE "Responsible" DROP CONSTRAINT "Responsible_userId_fkey";

-- AddForeignKey
ALTER TABLE "Responsible" ADD CONSTRAINT "Responsible_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
