import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class NutritionDto {
  @ApiPropertyOptional({ example: 300, description: 'Калории' })
  @IsOptional()
  @IsNumber()
  calories: number | null;

  @ApiPropertyOptional({ example: 12, description: 'Белки в граммах' })
  @IsOptional()
  @IsNumber()
  proteins: number | null;

  @ApiPropertyOptional({ example: 8, description: 'Жиры в граммах' })
  @IsOptional()
  @IsNumber()
  fats: number | null;

  @ApiPropertyOptional({ example: 45, description: 'Углеводы в граммах' })
  @IsOptional()
  @IsNumber()
  carbs: number | null;
}

export class DailyPlanMealDto {
  @ApiProperty({ example: 'breakfast', description: 'Ключ приёма пищи' })
  @IsString()
  mealKey: string;

  @ApiProperty({ type: [String], example: ['oatmeal', 'banana'], description: 'Ингредиенты' })
  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @ApiProperty({ example: '08:00', description: 'Время приёма пищи' })
  @IsString()
  time: string;

  @ApiProperty({ description: 'Пищевая ценность' })
  @ValidateNested()
  @Type(() => NutritionDto)
  nutrition: NutritionDto;

  @ApiPropertyOptional({ example: 200, description: 'Вес в граммах' })
  @IsOptional()
  @IsNumber()
  weight_grams: number | null;
}

export class DailyPlanResponseDto {
  @ApiProperty({ example: 1, description: 'ID диагноза' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'balanced_diet_general', description: 'Код диагноза' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Рекомендуемые калории' })
  @ValidateNested()
  @Type(() => NutritionDto)
  recommendedCalories: {
    min: number | null;
    max: number | null;
    unit: string;
  };

  @ApiProperty({ type: [String], example: ['oatmeal', 'banana'], description: 'Разрешённые продукты' })
  @IsArray()
  @IsString({ each: true })
  allowedFoods: string[];

  @ApiProperty({ type: [String], example: ['chocolate', 'sugar'], description: 'Запрещённые продукты' })
  @IsArray()
  @IsString({ each: true })
  prohibitedFoods: string[];

  @ApiProperty({ type: [DailyPlanMealDto], description: 'Дневной план питания' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DailyPlanMealDto)
  dailyPlan: DailyPlanMealDto[];
}

export class DailyPlanIngredientDto {
  @ApiProperty({ example: 1, description: 'ID ингредиента' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 1, description: 'ID дневного плана' })
  @IsNumber()
  dailyPlanId: number;

  @ApiProperty({ example: 1, description: 'ID продукта' })
  @IsNumber()
  foodId: number;

  @ApiProperty({
    example: {
      id: 1,
      code: 'oatmeal',
      name: 'Овсянка',
      type: 'ALLOWED'
    },
    description: 'Информация о продукте'
  })
  food: {
    id: number;
    code: string;
    name: string | null;
    type: string | null;
  };
}

export class DailyPlanWithIngredientsDto {
  @ApiProperty({ example: 1, description: 'ID дневного плана' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 1, description: 'ID диагноза' })
  @IsNumber()
  diagnosisId: number;

  @ApiProperty({ example: '08:00', description: 'Время приёма пищи' })
  @IsString()
  time: string;

  @ApiProperty({ example: 'breakfast', description: 'Ключ приёма пищи' })
  @IsString()
  mealKey: string;

  @ApiPropertyOptional({ example: 200, description: 'Вес в граммах' })
  @IsOptional()
  @IsNumber()
  weightGrams: number | null;

  @ApiPropertyOptional({ example: 300, description: 'Калории' })
  @IsOptional()
  @IsNumber()
  calories: number | null;

  @ApiPropertyOptional({ example: 12, description: 'Белки в граммах' })
  @IsOptional()
  @IsNumber()
  proteins: number | null;

  @ApiPropertyOptional({ example: 8, description: 'Жиры в граммах' })
  @IsOptional()
  @IsNumber()
  fats: number | null;

  @ApiPropertyOptional({ example: 45, description: 'Углеводы в граммах' })
  @IsOptional()
  @IsNumber()
  carbs: number | null;

  @ApiProperty({ type: [DailyPlanIngredientDto], description: 'Ингредиенты' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DailyPlanIngredientDto)
  ingredients: DailyPlanIngredientDto[];

  @ApiProperty({
    example: {
      id: 1,
      code: 'balanced_diet_general',
      description: 'Сбалансированная диета',
      recommendedMinKcal: 1800,
      recommendedMaxKcal: 2200
    },
    description: 'Информация о диагнозе'
  })
  diagnosis: {
    id: number;
    code: string;
    description: string | null;
    recommendedMinKcal: number | null;
    recommendedMaxKcal: number | null;
  };
}

export class CreateDailyPlanDto {
  @ApiProperty({ example: 1, description: 'ID диагноза' })
  @IsNumber()
  diagnosisId: number;

  @ApiProperty({ example: '08:00', description: 'Время приёма пищи' })
  @IsString()
  time: string;

  @ApiProperty({ example: 'breakfast', description: 'Ключ приёма пищи' })
  @IsString()
  mealKey: string;

  @ApiPropertyOptional({ example: 200, description: 'Вес в граммах' })
  @IsOptional()
  @IsNumber()
  weightGrams?: number;

  @ApiPropertyOptional({ example: 300, description: 'Калории' })
  @IsOptional()
  @IsNumber()
  calories?: number;

  @ApiPropertyOptional({ example: 12, description: 'Белки в граммах' })
  @IsOptional()
  @IsNumber()
  proteins?: number;

  @ApiPropertyOptional({ example: 8, description: 'Жиры в граммах' })
  @IsOptional()
  @IsNumber()
  fats?: number;

  @ApiPropertyOptional({ example: 45, description: 'Углеводы в граммах' })
  @IsOptional()
  @IsNumber()
  carbs?: number;
}

export class CreateDailyPlanWithIngredientsDto {
  @ApiProperty({ example: 1, description: 'ID диагноза' })
  @IsNumber()
  diagnosisId: number;

  @ApiProperty({ example: '08:00', description: 'Время приёма пищи' })
  @IsString()
  time: string;

  @ApiProperty({ example: 'breakfast', description: 'Ключ приёма пищи' })
  @IsString()
  mealKey: string;

  @ApiPropertyOptional({ example: 200, description: 'Вес в граммах' })
  @IsOptional()
  @IsNumber()
  weightGrams?: number;

  @ApiPropertyOptional({ example: 300, description: 'Калории' })
  @IsOptional()
  @IsNumber()
  calories?: number;

  @ApiPropertyOptional({ example: 12, description: 'Белки в граммах' })
  @IsOptional()
  @IsNumber()
  proteins?: number;

  @ApiPropertyOptional({ example: 8, description: 'Жиры в граммах' })
  @IsOptional()
  @IsNumber()
  fats?: number;

  @ApiPropertyOptional({ example: 45, description: 'Углеводы в граммах' })
  @IsOptional()
  @IsNumber()
  carbs?: number;

  @ApiProperty({ 
    type: 'array',
    items: {
      type: 'object',
      properties: {
        foodId: { type: 'number' }
      }
    },
    example: [{ foodId: 1 }, { foodId: 2 }], 
    description: 'Ингредиенты' 
  })
  @IsArray()
  ingredients: Array<{ foodId: number }>;
}

export class UpdateDailyPlanDto {
  @ApiPropertyOptional({ example: 1, description: 'ID диагноза' })
  @IsOptional()
  @IsNumber()
  diagnosisId?: number;

  @ApiPropertyOptional({ example: '08:00', description: 'Время приёма пищи' })
  @IsOptional()
  @IsString()
  time?: string;

  @ApiPropertyOptional({ example: 'breakfast', description: 'Ключ приёма пищи' })
  @IsOptional()
  @IsString()
  mealKey?: string;

  @ApiPropertyOptional({ example: 200, description: 'Вес в граммах' })
  @IsOptional()
  @IsNumber()
  weightGrams?: number;

  @ApiPropertyOptional({ example: 300, description: 'Калории' })
  @IsOptional()
  @IsNumber()
  calories?: number;

  @ApiPropertyOptional({ example: 12, description: 'Белки в граммах' })
  @IsOptional()
  @IsNumber()
  proteins?: number;

  @ApiPropertyOptional({ example: 8, description: 'Жиры в граммах' })
  @IsOptional()
  @IsNumber()
  fats?: number;

  @ApiPropertyOptional({ example: 45, description: 'Углеводы в граммах' })
  @IsOptional()
  @IsNumber()
  carbs?: number;
}
