/*
  Warnings:

  - You are about to drop the `loggings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "loggings";

-- CreateTable
CREATE TABLE "log" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "log_pkey" PRIMARY KEY ("id")
);
