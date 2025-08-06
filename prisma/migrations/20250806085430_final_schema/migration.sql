/*
  Warnings:

  - You are about to drop the column `meal` on the `DailyPlan` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Diagnosis` table. All the data in the column will be lost.
  - You are about to drop the `DiagnosisFood` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `Diagnosis` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Food` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mealKey` to the `DailyPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Diagnosis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."DiagnosisFood" DROP CONSTRAINT "DiagnosisFood_diagnosisId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DiagnosisFood" DROP CONSTRAINT "DiagnosisFood_foodId_fkey";

-- AlterTable
ALTER TABLE "public"."DailyPlan" DROP COLUMN "meal",
ADD COLUMN     "calories" INTEGER,
ADD COLUMN     "carbs" INTEGER,
ADD COLUMN     "fats" INTEGER,
ADD COLUMN     "mealKey" TEXT NOT NULL,
ADD COLUMN     "proteins" INTEGER,
ADD COLUMN     "weightGrams" INTEGER;

-- AlterTable
ALTER TABLE "public"."Diagnosis" DROP COLUMN "name",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "recommendedMaxKcal" INTEGER,
ADD COLUMN     "recommendedMinKcal" INTEGER;

-- AlterTable
ALTER TABLE "public"."Food" ADD COLUMN     "code" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "type" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."DiagnosisFood";

-- CreateTable
CREATE TABLE "public"."DiagnosisFoodRelation" (
    "diagnosisId" INTEGER NOT NULL,
    "foodId" INTEGER NOT NULL,
    "allowed" BOOLEAN NOT NULL,

    CONSTRAINT "DiagnosisFoodRelation_pkey" PRIMARY KEY ("diagnosisId","foodId")
);

-- CreateTable
CREATE TABLE "public"."DailyPlanIngredient" (
    "id" SERIAL NOT NULL,
    "dailyPlanId" INTEGER NOT NULL,
    "foodId" INTEGER NOT NULL,

    CONSTRAINT "DailyPlanIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Diagnosis_code_key" ON "public"."Diagnosis"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Food_code_key" ON "public"."Food"("code");

-- AddForeignKey
ALTER TABLE "public"."DiagnosisFoodRelation" ADD CONSTRAINT "DiagnosisFoodRelation_diagnosisId_fkey" FOREIGN KEY ("diagnosisId") REFERENCES "public"."Diagnosis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiagnosisFoodRelation" ADD CONSTRAINT "DiagnosisFoodRelation_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "public"."Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DailyPlanIngredient" ADD CONSTRAINT "DailyPlanIngredient_dailyPlanId_fkey" FOREIGN KEY ("dailyPlanId") REFERENCES "public"."DailyPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DailyPlanIngredient" ADD CONSTRAINT "DailyPlanIngredient_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "public"."Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
