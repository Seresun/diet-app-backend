import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DailyPlan, Prisma } from '@prisma/client';

type DailyPlanWithIngredients = DailyPlan & {
  ingredients: Array<{
    id: number;
    dailyPlanId: number;
    foodId: number;
    food: {
      id: number;
      code: string;
      name: string | null;
      type: string | null;
    };
  }>;
  diagnosis: {
    id: number;
    code: string;
    description: string | null;
    recommendedMinKcal: number | null;
    recommendedMaxKcal: number | null;
  };
};

@Injectable()
export class DailyPlanService {
  constructor(private prisma: PrismaService) {}

  // Utility function to ensure ingredients is always an array
  public ensureSafeIngredients(dailyPlan: DailyPlanWithIngredients): DailyPlanWithIngredients {
    if (!dailyPlan.ingredients) {
      dailyPlan.ingredients = [];
    }
    return dailyPlan;
  }

  // Utility function to safely get ingredients array
  private getSafeIngredients(plan: DailyPlanWithIngredients | null): Array<any> {
    return plan?.ingredients || [];
  }

  async createDailyPlan(data: Prisma.DailyPlanCreateInput): Promise<DailyPlanWithIngredients> {
    const result = await this.prisma.dailyPlan.create({
      data,
      include: {
        diagnosis: true,
        ingredients: {
          include: {
            food: true,
          },
        },
      },
    }) as DailyPlanWithIngredients;
    
    return this.ensureSafeIngredients(result);
  }

  async findAllDailyPlans(): Promise<DailyPlanWithIngredients[]> {
    const results = await this.prisma.dailyPlan.findMany({
      include: {
        diagnosis: true,
        ingredients: {
          include: {
            food: true,
          },
        },
      },
    }) as DailyPlanWithIngredients[];
    
    return results.map(plan => this.ensureSafeIngredients(plan));
  }

  async findDailyPlanById(id: number): Promise<DailyPlanWithIngredients | null> {
    const result = await this.prisma.dailyPlan.findUnique({
      where: { id },
      include: {
        diagnosis: true,
        ingredients: {
          include: {
            food: true,
          },
        },
      },
    }) as DailyPlanWithIngredients | null;
    
    return result ? this.ensureSafeIngredients(result) : null;
  }

  async findDailyPlansByDiagnosis(diagnosisId: number): Promise<DailyPlanWithIngredients[]> {
    const results = await this.prisma.dailyPlan.findMany({
      where: { 
        diagnosisId: {
          equals: diagnosisId
        }
      },
      include: {
        diagnosis: true,
        ingredients: {
          include: {
            food: true,
          },
        },
      },
    }) as DailyPlanWithIngredients[];
    
    return results.map(plan => this.ensureSafeIngredients(plan));
  }

  async findDailyPlansByMealKey(mealKey: string): Promise<DailyPlanWithIngredients[]> {
    const results = await this.prisma.dailyPlan.findMany({
      where: { mealKey },
      include: {
        diagnosis: true,
        ingredients: {
          include: {
            food: true,
          },
        },
      },
    }) as DailyPlanWithIngredients[];
    
    return results.map(plan => this.ensureSafeIngredients(plan));
  }

  async updateDailyPlan(
    id: number,
    data: Prisma.DailyPlanUpdateInput,
  ): Promise<DailyPlanWithIngredients> {
    const result = await this.prisma.dailyPlan.update({
      where: { id },
      data,
      include: {
        diagnosis: true,
        ingredients: {
          include: {
            food: true,
          },
        },
      },
    }) as DailyPlanWithIngredients;
    
    return this.ensureSafeIngredients(result);
  }

  async deleteDailyPlan(id: number): Promise<DailyPlanWithIngredients> {
    const result = await this.prisma.dailyPlan.delete({
      where: { id },
      include: {
        diagnosis: true,
        ingredients: {
          include: {
            food: true,
          },
        },
      },
    }) as DailyPlanWithIngredients;
    
    return this.ensureSafeIngredients(result);
  }

  async createDailyPlanWithIngredients(
    dailyPlanData: {
      diagnosisId: number;
      time: string;
      mealKey: string;
      weightGrams?: number;
      calories?: number;
      proteins?: number;
      fats?: number;
      carbs?: number;
    },
    ingredientsData: Array<{ foodId: number }>
  ): Promise<DailyPlanWithIngredients> {
    const result = await this.prisma.dailyPlan.create({
      data: {
        ...dailyPlanData,
        ingredients: {
          create: ingredientsData,
        },
      },
      include: {
        diagnosis: true,
        ingredients: {
          include: {
            food: true,
          },
        },
      },
    }) as DailyPlanWithIngredients;
    
    return this.ensureSafeIngredients(result);
  }

  // Public method to get safe ingredients for external use
  getSafeIngredientsArray(plan: DailyPlanWithIngredients | null): Array<any> {
    return plan?.ingredients || [];
  }
}
