-- CreateEnum
CREATE TYPE "PAYMENT_STATUS" AS ENUM ('draft', 'open', 'paid', 'uncollectible', 'void');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "PAYMENT_STATUS" DEFAULT 'open';
