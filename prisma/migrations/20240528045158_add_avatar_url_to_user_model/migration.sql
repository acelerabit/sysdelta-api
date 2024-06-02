-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_url" TEXT;

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");
