import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RecommendedCaloriesDto {
  @ApiProperty({ example: 1800, description: 'Минимальное количество калорий' })
  @IsNumber()
  min: number;

  @ApiProperty({ example: 2200, description: 'Максимальное количество калорий' })
  @IsNumber()
  max: number;

  @ApiProperty({ example: 'kcal', description: 'Единица измерения калорий' })
  @IsString()
  unit: string;
}

export class FoodInDiagnosisDto {
  @ApiProperty({ example: 1, description: 'ID диагноза' })
  @IsNumber()
  diagnosisId: number;

  @ApiProperty({ example: 1, description: 'ID продукта' })
  @IsNumber()
  foodId: number;

  @ApiProperty({ example: true, description: 'Разрешён ли продукт' })
  allowed: boolean;

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

export class DailyPlanInDiagnosisDto {
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
}

export class DiagnosisResponseDto {
  @ApiProperty({ example: 1, description: 'ID диагноза' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'balanced_diet_general', description: 'Код диагноза' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Сбалансированная диета для общего здоровья', description: 'Описание диагноза' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Рекомендуемые калории' })
  @ValidateNested()
  @Type(() => RecommendedCaloriesDto)
  recommendedCalories: RecommendedCaloriesDto;

  @ApiProperty({ type: [FoodInDiagnosisDto], description: 'Связанные продукты' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FoodInDiagnosisDto)
  foods: FoodInDiagnosisDto[];

  @ApiProperty({ type: [DailyPlanInDiagnosisDto], description: 'Дневные планы' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DailyPlanInDiagnosisDto)
  dailyPlans: DailyPlanInDiagnosisDto[];
}

export class CreateDiagnosisDto {
  @ApiProperty({ example: 'balanced_diet_general', description: 'Код диагноза' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ example: 'Сбалансированная диета для общего здоровья', description: 'Описание диагноза' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1800, description: 'Минимальное количество калорий' })
  @IsOptional()
  @IsNumber()
  recommendedMinKcal?: number;

  @ApiPropertyOptional({ example: 2200, description: 'Максимальное количество калорий' })
  @IsOptional()
  @IsNumber()
  recommendedMaxKcal?: number;
}

export class UpdateDiagnosisDto {
  @ApiPropertyOptional({ example: 'balanced_diet_general', description: 'Код диагноза' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: 'Сбалансированная диета для общего здоровья', description: 'Описание диагноза' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1800, description: 'Минимальное количество калорий' })
  @IsOptional()
  @IsNumber()
  recommendedMinKcal?: number;

  @ApiPropertyOptional({ example: 2200, description: 'Максимальное количество калорий' })
  @IsOptional()
  @IsNumber()
  recommendedMaxKcal?: number;
}
