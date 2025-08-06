import { PrismaClient } from '@prisma/client';
import diagnoses from './diagnoses.json';

declare const console: any;

const prisma = new PrismaClient();

async function main() {
  for (const d of diagnoses) {
    const diagnosis = await prisma.diagnosis.create({
      data: {
        code: d.id,
        recommendedMinKcal: d.recommendedCalories.min,
        recommendedMaxKcal: d.recommendedCalories.max,
        description: '',
      },
    });

    // Foods (allowed)
    for (const f of d.allowedFoods) {
      const food = await prisma.food.upsert({
        where: { code: f },
        update: {},
        create: { code: f },
      });
      await prisma.diagnosisFoodRelation.create({
        data: {
          diagnosisId: diagnosis.id,
          foodId: food.id,
          allowed: true,
        },
      });
    }

    // Foods (prohibited)
    for (const f of d.prohibitedFoods) {
      const food = await prisma.food.upsert({
        where: { code: f },
        update: {},
        create: { code: f },
      });
      await prisma.diagnosisFoodRelation.create({
        data: {
          diagnosisId: diagnosis.id,
          foodId: food.id,
          allowed: false,
        },
      });
    }

    // Daily plan
    for (const p of d.dailyPlan) {
      const dailyPlan = await prisma.dailyPlan.create({
        data: {
          diagnosisId: diagnosis.id,
          time: p.time,
          mealKey: p.mealKey,
          weightGrams: p.weight_grams,
          calories: p.nutrition.calories,
          proteins: p.nutrition.proteins,
          fats: p.nutrition.fats,
          carbs: p.nutrition.carbs,
        },
      });

      // Ingredients
      for (const i of p.ingredients) {
        const food = await prisma.food.upsert({
          where: { code: i },
          update: {},
          create: { code: i },
        });
        await prisma.dailyPlanIngredient.create({
          data: {
            dailyPlanId: dailyPlan.id,
            foodId: food.id,
          },
        });
      }
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
