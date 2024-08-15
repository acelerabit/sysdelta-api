-- AlterTable
ALTER TABLE "users" ADD COLUMN     "affiliatedCouncilId" TEXT;

-- CreateTable
CREATE TABLE "city_council" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "city_council_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Responsible" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cityCouncilId" TEXT NOT NULL,

    CONSTRAINT "Responsible_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Responsible_userId_key" ON "Responsible"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Responsible_cityCouncilId_key" ON "Responsible"("cityCouncilId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_affiliatedCouncilId_fkey" FOREIGN KEY ("affiliatedCouncilId") REFERENCES "city_council"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responsible" ADD CONSTRAINT "Responsible_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responsible" ADD CONSTRAINT "Responsible_cityCouncilId_fkey" FOREIGN KEY ("cityCouncilId") REFERENCES "city_council"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
