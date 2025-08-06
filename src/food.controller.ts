import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { Food, Prisma, FoodType } from '@prisma/client';

@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  async getAllFoods(@Query('type') type?: FoodType): Promise<Food[]> {
    if (type) {
      return await this.foodService.findFoodsByType(type);
    }
    return await this.foodService.findAllFoods();
  }

  @Get('code/:code')
  async getFoodByCode(@Param('code') code: string): Promise<Food> {
    const food = await this.foodService.findFoodByCode(code);
    if (!food) {
      throw new NotFoundException('Food not found');
    }
    return food;
  }

  @Get(':id')
  async getFoodById(@Param('id') id: string): Promise<Food> {
    const food = await this.foodService.findFoodById(parseInt(id));
    if (!food) {
      throw new NotFoundException('Food not found');
    }
    return food;
  }

  @Post()
  async createFood(@Body() createFoodDto: Prisma.FoodCreateInput): Promise<Food> {
    return await this.foodService.createFood(createFoodDto);
  }

  @Put(':id')
  async updateFood(
    @Param('id') id: string,
    @Body() updateFoodDto: Prisma.FoodUpdateInput,
  ): Promise<Food> {
    return await this.foodService.updateFood(parseInt(id), updateFoodDto);
  }

  @Delete(':id')
  async deleteFood(@Param('id') id: string): Promise<Food> {
    return await this.foodService.deleteFood(parseInt(id));
  }
}
