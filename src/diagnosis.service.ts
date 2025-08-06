import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Diagnosis, Prisma } from '@prisma/client';

@Injectable()
export class DiagnosisService {
  constructor(private prisma: PrismaService) {}

  async createDiagnosis(data: Prisma.DiagnosisCreateInput): Promise<Diagnosis> {
    return await this.prisma.diagnosis.create({
      data,
    });
  }

  async findAllDiagnoses(): Promise<Diagnosis[]> {
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
    });
  }

  async findDiagnosisById(id: number): Promise<Diagnosis | null> {
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
    });
  }

  async findDiagnosisByCode(code: string): Promise<Diagnosis | null> {
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
    });
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
