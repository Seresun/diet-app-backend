import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class DiagnosisFoodRelationResponseDto {
  @ApiProperty({ example: 1, description: 'ID диагноза' })
  @IsNumber()
  diagnosisId: number;

  @ApiProperty({ example: 1, description: 'ID продукта' })
  @IsNumber()
  foodId: number;

  @ApiProperty({ example: true, description: 'Разрешён ли продукт' })
  @IsBoolean()
  allowed: boolean;

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

export class CreateDiagnosisFoodRelationDto {
  @ApiProperty({ example: 1, description: 'ID диагноза' })
  @IsNumber()
  diagnosisId: number;

  @ApiProperty({ example: 1, description: 'ID продукта' })
  @IsNumber()
  foodId: number;

  @ApiProperty({ example: true, description: 'Разрешён ли продукт' })
  @IsBoolean()
  allowed: boolean;
}

export class UpdateDiagnosisFoodRelationDto {
  @ApiPropertyOptional({ example: true, description: 'Разрешён ли продукт' })
  @IsOptional()
  @IsBoolean()
  allowed?: boolean;
}
