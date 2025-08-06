import { PrismaClient } from '@prisma/client';
import diagnoses from './diagnoses.json';

declare const console: any;
declare const process: any;

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');
  
  let totalDiagnoses = 0;
  let totalFoods = 0;
  let totalRelations = 0;
  let totalDailyPlans = 0;
  let totalIngredients = 0;

  for (const d of diagnoses) {
    console.log(`📋 Processing diagnosis: ${d.id}`);
    
    // Create or update diagnosis
    const diagnosis = await prisma.diagnosis.upsert({
      where: { code: d.id },
      update: {
        recommendedMinKcal: d.recommendedCalories.min,
        recommendedMaxKcal: d.recommendedCalories.max,
        description: '',
      },
      create: {
        code: d.id,
        recommendedMinKcal: d.recommendedCalories.min,
        recommendedMaxKcal: d.recommendedCalories.max,
        description: '',
      },
    });
    totalDiagnoses++;

    console.log(`✅ Created/Updated diagnosis: ${diagnosis.code} (ID: ${diagnosis.id})`);

    // Foods (allowed)
    console.log(`🍎 Processing ${d.allowedFoods.length} allowed foods...`);
    for (const f of d.allowedFoods) {
      const food = await prisma.food.upsert({
        where: { code: f },
        update: {},
        create: { code: f },
      });
      
      await prisma.diagnosisFoodRelation.upsert({
        where: {
          diagnosisId_foodId: {
            diagnosisId: diagnosis.id,
            foodId: food.id,
          },
        },
        update: { allowed: true },
        create: {
          diagnosisId: diagnosis.id,
          foodId: food.id,
          allowed: true,
        },
      });
      totalFoods++;
      totalRelations++;
    }

    // Foods (prohibited)
    console.log(`🚫 Processing ${d.prohibitedFoods.length} prohibited foods...`);
    for (const f of d.prohibitedFoods) {
      const food = await prisma.food.upsert({
        where: { code: f },
        update: {},
        create: { code: f },
      });
      
      await prisma.diagnosisFoodRelation.upsert({
        where: {
          diagnosisId_foodId: {
            diagnosisId: diagnosis.id,
            foodId: food.id,
          },
        },
        update: { allowed: false },
        create: {
          diagnosisId: diagnosis.id,
          foodId: food.id,
          allowed: false,
        },
      });
      totalFoods++;
      totalRelations++;
    }

    // Clear existing daily plans for this diagnosis
    await prisma.dailyPlanIngredient.deleteMany({
      where: {
        dailyPlan: {
          diagnosisId: diagnosis.id,
        },
      },
    });
    await prisma.dailyPlan.deleteMany({
      where: { diagnosisId: diagnosis.id },
    });

    // Daily plans
    console.log(`📅 Processing ${d.dailyPlan.length} daily plans...`);
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
      totalDailyPlans++;

      console.log(`🍽️ Created daily plan: ${dailyPlan.mealKey} (ID: ${dailyPlan.id})`);

      // Ingredients
      console.log(`🥘 Processing ${p.ingredients.length} ingredients for ${dailyPlan.mealKey}...`);
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
        totalIngredients++;
      }
    }
    
    console.log(`✅ Completed diagnosis: ${d.id}\n`);
  }

  // Final summary
  console.log('🎉 Database seeding completed!');
  console.log('📊 Summary:');
  console.log(`   - Diagnoses: ${totalDiagnoses}`);
  console.log(`   - Foods: ${totalFoods}`);
  console.log(`   - Diagnosis-Food Relations: ${totalRelations}`);
  console.log(`   - Daily Plans: ${totalDailyPlans}`);
  console.log(`   - Ingredients: ${totalIngredients}`);
  
  // Verify data integrity
  console.log('\n🔍 Verifying data integrity...');
  
  const diagnosisCount = await prisma.diagnosis.count();
  const foodCount = await prisma.food.count();
  const relationCount = await prisma.diagnosisFoodRelation.count();
  const dailyPlanCount = await prisma.dailyPlan.count();
  const ingredientCount = await prisma.dailyPlanIngredient.count();
  
  console.log(`   - Actual Diagnoses in DB: ${diagnosisCount}`);
  console.log(`   - Actual Foods in DB: ${foodCount}`);
  console.log(`   - Actual Relations in DB: ${relationCount}`);
  console.log(`   - Actual Daily Plans in DB: ${dailyPlanCount}`);
  console.log(`   - Actual Ingredients in DB: ${ingredientCount}`);
  
  if (diagnosisCount === totalDiagnoses && 
      relationCount === totalRelations && 
      dailyPlanCount === totalDailyPlans && 
      ingredientCount === totalIngredients) {
    console.log('✅ All data verified successfully!');
  } else {
    console.log('⚠️ Data verification failed! Check the counts above.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
