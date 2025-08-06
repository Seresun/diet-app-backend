import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { DailyPlanService } from './daily-plan.service';
import { DiagnosisService } from './diagnosis.service';
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

// Тип для ответа фронтенду
interface DailyPlanResponseDto {
  allowedFoods: string[];
  prohibitedFoods: string[];
  dailyPlan: Array<{
    time: string;
    mealKey: string;
    ingredients: string[];
    weight_grams: number | null;
    nutrition: {
      calories: number | null;
      proteins: number | null;
      fats: number | null;
      carbs: number | null;
    };
  }>;
}

@Controller('daily-plan')
export class DailyPlanController {
  constructor(
    private readonly dailyPlanService: DailyPlanService,
    private readonly diagnosisService: DiagnosisService,
  ) {}

  @Get()
  async getAllDailyPlans(): Promise<DailyPlanWithIngredients[]> {
    return await this.dailyPlanService.findAllDailyPlans();
  }

  @Get(':diagnosisId')
  async getDailyPlanByDiagnosisId(@Param('diagnosisId') diagnosisId: string): Promise<DailyPlanResponseDto> {
    const diagnosis = await this.diagnosisService.findDiagnosisById(parseInt(diagnosisId));
    
    if (!diagnosis) {
      throw new NotFoundException('Diagnosis not found');
    }

    // Разделяем продукты на разрешенные и запрещенные
    const allowedFoods: string[] = [];
    const prohibitedFoods: string[] = [];

    diagnosis.foods.forEach(relation => {
      if (relation.allowed) {
        allowedFoods.push(relation.food.code);
      } else {
        prohibitedFoods.push(relation.food.code);
      }
    });

    // Формируем daily plan в нужном формате
    const dailyPlan = diagnosis.dailyPlans.map(plan => ({
      time: plan.time,
      mealKey: plan.mealKey,
      ingredients: plan.ingredients.map(ingredient => ingredient.food.code),
      weight_grams: plan.weightGrams,
      nutrition: {
        calories: plan.calories,
        proteins: plan.proteins,
        fats: plan.fats,
        carbs: plan.carbs,
      },
    }));

    return {
      allowedFoods,
      prohibitedFoods,
      dailyPlan,
    };
  }

  @Get('id/:id')
  async getDailyPlanById(@Param('id') id: string): Promise<DailyPlanWithIngredients> {
    const dailyPlan = await this.dailyPlanService.findDailyPlanById(parseInt(id));
    if (!dailyPlan) {
      throw new NotFoundException('Daily plan not found');
    }
    return this.dailyPlanService.ensureSafeIngredients(dailyPlan);
  }

  @Post()
  async createDailyPlan(@Body() createDto: Prisma.DailyPlanCreateInput): Promise<DailyPlanWithIngredients> {
    const dailyPlan = await this.dailyPlanService.createDailyPlan(createDto);
    return this.dailyPlanService.ensureSafeIngredients(dailyPlan);
  }

  @Post('with-ingredients')
  async createDailyPlanWithIngredients(
    @Body() createDto: {
      diagnosisId: number;
      time: string;
      mealKey: string;
      weightGrams?: number;
      calories?: number;
      proteins?: number;
      fats?: number;
      carbs?: number;
      ingredients: Array<{ foodId: number }>;
    },
  ): Promise<DailyPlanWithIngredients> {
    const { ingredients, ...dailyPlanData } = createDto;
    const dailyPlan = await this.dailyPlanService.createDailyPlanWithIngredients(
      dailyPlanData,
      ingredients,
    );
    return this.dailyPlanService.ensureSafeIngredients(dailyPlan);
  }

  @Put(':id')
  async updateDailyPlan(
    @Param('id') id: string,
    @Body() updateDto: Prisma.DailyPlanUpdateInput,
  ): Promise<DailyPlanWithIngredients> {
    const dailyPlan = await this.dailyPlanService.updateDailyPlan(parseInt(id), updateDto);
    return this.dailyPlanService.ensureSafeIngredients(dailyPlan);
  }

  @Delete(':id')
  async deleteDailyPlan(@Param('id') id: string): Promise<DailyPlan> {
    return await this.dailyPlanService.deleteDailyPlan(parseInt(id));
  }
}
