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
import { DiagnosisService } from './diagnosis.service';
import { Diagnosis, Prisma } from '@prisma/client';

// DTO for diagnosis response - Updated structure
interface DiagnosisResponseDto {
  id: number;
  code: string;
  description: string;
  recommendedCalories: {
    min: number;
    max: number;
  };
  foods: Array<{
    diagnosisId: number;
    foodId: number;
    allowed: boolean;
    food: {
      id: number;
      code: string;
      name: string | null;
      type: string | null;
    };
  }>;
  dailyPlans: Array<{
    id: number;
    diagnosisId: number;
    time: string;
    mealKey: string;
    weightGrams: number | null;
    calories: number | null;
    proteins: number | null;
    fats: number | null;
    carbs: number | null;
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
  }>;
}

@Controller('diagnoses')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Get()
  async getAllDiagnoses(): Promise<DiagnosisResponseDto[]> {
    const diagnoses = await this.diagnosisService.findAllDiagnoses();
    return diagnoses.map(diagnosis => ({
      id: diagnosis.id,
      code: diagnosis.code,
      description: diagnosis.description || '',
      recommendedCalories: {
        min: diagnosis.recommendedMinKcal || 0,
        max: diagnosis.recommendedMaxKcal || 0,
      },
      foods: diagnosis.foods || [],
      dailyPlans: diagnosis.dailyPlans || [],
    }));
  }

  @Get(':code')
  async getDiagnosisByCode(@Param('code') code: string): Promise<DiagnosisResponseDto> {
    const diagnosis = await this.diagnosisService.findDiagnosisByCode(code);
    if (!diagnosis) {
      throw new NotFoundException('Diagnosis not found');
    }
    return {
      id: diagnosis.id,
      code: diagnosis.code,
      description: diagnosis.description || '',
      recommendedCalories: {
        min: diagnosis.recommendedMinKcal || 0,
        max: diagnosis.recommendedMaxKcal || 0,
      },
      foods: diagnosis.foods || [],
      dailyPlans: diagnosis.dailyPlans || [],
    };
  }

  @Get('id/:id')
  async getDiagnosisById(@Param('id') id: string): Promise<DiagnosisResponseDto> {
    const diagnosis = await this.diagnosisService.findDiagnosisById(parseInt(id));
    if (!diagnosis) {
      throw new NotFoundException('Diagnosis not found');
    }
    return {
      id: diagnosis.id,
      code: diagnosis.code,
      description: diagnosis.description || '',
      recommendedCalories: {
        min: diagnosis.recommendedMinKcal || 0,
        max: diagnosis.recommendedMaxKcal || 0,
      },
      foods: diagnosis.foods || [],
      dailyPlans: diagnosis.dailyPlans || [],
    };
  }

  @Post()
  async createDiagnosis(
    @Body() createDiagnosisDto: Prisma.DiagnosisCreateInput,
  ): Promise<Diagnosis> {
    return await this.diagnosisService.createDiagnosis(createDiagnosisDto);
  }

  @Put(':id')
  async updateDiagnosis(
    @Param('id') id: string,
    @Body() updateDiagnosisDto: Prisma.DiagnosisUpdateInput,
  ): Promise<Diagnosis> {
    return await this.diagnosisService.updateDiagnosis(
      parseInt(id),
      updateDiagnosisDto,
    );
  }

  @Delete(':id')
  async deleteDiagnosis(@Param('id') id: string): Promise<Diagnosis> {
    return await this.diagnosisService.deleteDiagnosis(parseInt(id));
  }
}
