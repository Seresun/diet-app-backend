import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Food, Prisma, FoodType } from '@prisma/client';

@Injectable()
export class FoodService {
  constructor(private prisma: PrismaService) {}

  async createFood(data: Prisma.FoodCreateInput): Promise<Food> {
    return await this.prisma.food.create({
      data,
    });
  }

  async findAllFoods(): Promise<Food[]> {
    return await this.prisma.food.findMany({
      include: {
        diagnoses: {
          include: {
            diagnosis: true,
          },
        },
        dailyPlanIngredients: {
          include: {
            dailyPlan: true,
          },
        },
      },
    });
  }

  async findFoodById(id: number): Promise<Food | null> {
    return await this.prisma.food.findUnique({
      where: { id },
      include: {
        diagnoses: {
          include: {
            diagnosis: true,
          },
        },
        dailyPlanIngredients: {
          include: {
            dailyPlan: true,
          },
        },
      },
    });
  }

  async findFoodByCode(code: string): Promise<Food | null> {
    return await this.prisma.food.findUnique({
      where: { code },
      include: {
        diagnoses: {
          include: {
            diagnosis: true,
          },
        },
        dailyPlanIngredients: {
          include: {
            dailyPlan: true,
          },
        },
      },
    });
  }

  async findFoodsByType(type: FoodType): Promise<Food[]> {
    return await this.prisma.food.findMany({
      where: { type },
    });
  }

  async updateFood(
    id: number,
    data: Prisma.FoodUpdateInput,
  ): Promise<Food> {
    return await this.prisma.food.update({
      where: { id },
      data,
    });
  }

  async deleteFood(id: number): Promise<Food> {
    return await this.prisma.food.delete({
      where: { id },
    });
  }
}
