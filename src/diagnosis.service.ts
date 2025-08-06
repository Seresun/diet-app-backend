import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Diagnosis, Prisma } from '@prisma/client';

// Тип для диагноза с включенными связями
type DiagnosisWithRelations = Diagnosis & {
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
};

@Injectable()
export class DiagnosisService {
  constructor(private prisma: PrismaService) {}

  async createDiagnosis(data: Prisma.DiagnosisCreateInput): Promise<Diagnosis> {
    return await this.prisma.diagnosis.create({
      data,
    });
  }

  async findAllDiagnoses(): Promise<DiagnosisWithRelations[]> {
    return await this.prisma.diagnosis.findMany({
      include: {
        foods: {
          include: {
            food: true,
          },
        },
        dailyPlans: {
          include: {
            ingredients: {
              include: {
                food: true,
              },
            },
          },
        },
      },
    }) as DiagnosisWithRelations[];
  }

  async findDiagnosisById(id: number): Promise<DiagnosisWithRelations | null> {
    return await this.prisma.diagnosis.findUnique({
      where: { id },
      include: {
        foods: {
          include: {
            food: true,
          },
        },
        dailyPlans: {
          include: {
            ingredients: {
              include: {
                food: true,
              },
            },
          },
        },
      },
    }) as DiagnosisWithRelations | null;
  }

  async findDiagnosisByCode(code: string): Promise<DiagnosisWithRelations | null> {
    return await this.prisma.diagnosis.findUnique({
      where: { code },
      include: {
        foods: {
          include: {
            food: true,
          },
        },
        dailyPlans: {
          include: {
            ingredients: {
              include: {
                food: true,
              },
            },
          },
        },
      },
    }) as DiagnosisWithRelations | null;
  }

  async updateDiagnosis(
    id: number,
    data: Prisma.DiagnosisUpdateInput,
  ): Promise<Diagnosis> {
    return await this.prisma.diagnosis.update({
      where: { id },
      data,
    });
  }

  async deleteDiagnosis(id: number): Promise<Diagnosis> {
    return await this.prisma.diagnosis.delete({
      where: { id },
    });
  }
}
