/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."FoodType" AS ENUM ('ALLOWED', 'PROHIBITED');

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."Diagnosis" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Diagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Food" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."FoodType" NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DiagnosisFood" (
    "diagnosisId" INTEGER NOT NULL,
    "foodId" INTEGER NOT NULL,

    CONSTRAINT "DiagnosisFood_pkey" PRIMARY KEY ("diagnosisId","foodId")
);

-- CreateTable
CREATE TABLE "public"."DailyPlan" (
    "id" SERIAL NOT NULL,
    "diagnosisId" INTEGER NOT NULL,
    "time" TEXT NOT NULL,
    "meal" TEXT NOT NULL,

    CONSTRAINT "DailyPlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."DiagnosisFood" ADD CONSTRAINT "DiagnosisFood_diagnosisId_fkey" FOREIGN KEY ("diagnosisId") REFERENCES "public"."Diagnosis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiagnosisFood" ADD CONSTRAINT "DiagnosisFood_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "public"."Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DailyPlan" ADD CONSTRAINT "DailyPlan_diagnosisId_fkey" FOREIGN KEY ("diagnosisId") REFERENCES "public"."Diagnosis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
