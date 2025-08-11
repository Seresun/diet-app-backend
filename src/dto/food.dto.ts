import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { FoodType as PrismaFoodType } from '@prisma/client';

export type FoodType = PrismaFoodType;

export class FoodResponseDto {
  @ApiProperty({ example: 1, description: 'ID продукта' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'oatmeal', description: 'Код продукта' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ example: 'Овсянка', description: 'Название продукта' })
  @IsOptional()
  @IsString()
  name: string | null;

  @ApiPropertyOptional({ 
    enum: ['ALLOWED', 'PROHIBITED'], 
    example: 'ALLOWED', 
    description: 'Тип продукта' 
  })
  @IsOptional()
  @IsEnum(['ALLOWED', 'PROHIBITED'])
  type: FoodType | null;
}

export class CreateFoodDto {
  @ApiProperty({ example: 'oatmeal', description: 'Код продукта' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ example: 'Овсянка', description: 'Название продукта' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ 
    enum: ['ALLOWED', 'PROHIBITED'], 
    example: 'ALLOWED', 
    description: 'Тип продукта' 
  })
  @IsOptional()
  @IsEnum(['ALLOWED', 'PROHIBITED'])
  type?: FoodType;
}

export class UpdateFoodDto {
  @ApiPropertyOptional({ example: 'oatmeal', description: 'Код продукта' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: 'Овсянка', description: 'Название продукта' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ 
    enum: ['ALLOWED', 'PROHIBITED'], 
    example: 'ALLOWED', 
    description: 'Тип продукта' 
  })
  @IsOptional()
  @IsEnum(['ALLOWED', 'PROHIBITED'])
  type?: FoodType;
}
