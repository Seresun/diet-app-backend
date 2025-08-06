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

@Controller('daily-plan')
export class DailyPlanController {
  constructor(private readonly dailyPlanService: DailyPlanService) {}

  // Utility function to ensure ingredients is always an array
  private ensureSafeIngredients(dailyPlan: DailyPlanWithIngredients): DailyPlanWithIngredients {
    if (!dailyPlan.ingredients) {
      dailyPlan.ingredients = [];
    }
    return dailyPlan;
  }

  @Get()
  async getAllDailyPlans(): Promise<DailyPlanWithIngredients[]> {
    const dailyPlans = await this.dailyPlanService.findAllDailyPlans();
    // The service already handles safe ingredients, but we ensure it here too
    return dailyPlans.map(plan => this.ensureSafeIngredients(plan));
  }

  @Get(':diagnosisId')
  async getDailyPlansByDiagnosis(
    @Param('diagnosisId') diagnosisId: string,
  ): Promise<DailyPlanWithIngredients[]> {
    const dailyPlans = await this.dailyPlanService.findDailyPlansByDiagnosis(
      parseInt(diagnosisId),
    );
    // The service already handles safe ingredients, but we ensure it here too
    return dailyPlans.map(plan => this.ensureSafeIngredients(plan));
  }

  @Get('id/:id')
  async getDailyPlanById(@Param('id') id: string): Promise<DailyPlanWithIngredients> {
    const dailyPlan = await this.dailyPlanService.findDailyPlanById(parseInt(id));
    if (!dailyPlan) {
      throw new NotFoundException('Daily plan not found');
    }
    // The service already handles safe ingredients, but we ensure it here too
    return this.ensureSafeIngredients(dailyPlan);
  }

  @Post()
  async createDailyPlan(
    @Body() createDailyPlanDto: Prisma.DailyPlanCreateInput,
  ): Promise<DailyPlanWithIngredients> {
    const dailyPlan = await this.dailyPlanService.createDailyPlan(createDailyPlanDto);
    // The service already handles safe ingredients, but we ensure it here too
    return this.ensureSafeIngredients(dailyPlan);
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
    // The service already handles safe ingredients, but we ensure it here too
    return this.ensureSafeIngredients(dailyPlan);
  }

  @Put(':id')
  async updateDailyPlan(
    @Param('id') id: string,
    @Body() updateDailyPlanDto: Prisma.DailyPlanUpdateInput,
  ): Promise<DailyPlanWithIngredients> {
    const dailyPlan = await this.dailyPlanService.updateDailyPlan(
      parseInt(id),
      updateDailyPlanDto,
    );
    // The service already handles safe ingredients, but we ensure it here too
    return this.ensureSafeIngredients(dailyPlan);
  }

  @Delete(':id')
  async deleteDailyPlan(@Param('id') id: string): Promise<DailyPlanWithIngredients> {
    const dailyPlan = await this.dailyPlanService.deleteDailyPlan(parseInt(id));
    // The service already handles safe ingredients, but we ensure it here too
    return this.ensureSafeIngredients(dailyPlan);
  }
}
