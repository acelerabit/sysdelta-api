-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PRESIDENT', 'COUNCILOR', 'SECRETARY', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "Actions" AS ENUM ('UPDATE');

-- CreateTable
CREATE TABLE "city_council" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "city_council_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "avatar_url" TEXT,
    "accept_notifications" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "cpf" TEXT,
    "political_party" TEXT,
    "role" "Role" NOT NULL DEFAULT 'ASSISTANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "affiliatedCouncilId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Responsible" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cityCouncilId" TEXT NOT NULL,

    CONSTRAINT "Responsible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "action" "Actions" NOT NULL,
    "after" JSONB,
    "before" JSONB,
    "model_name" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "city_council_cnpj_key" ON "city_council"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

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

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
