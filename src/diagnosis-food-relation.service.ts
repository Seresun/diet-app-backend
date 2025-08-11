import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DiagnosisFoodRelation, Prisma } from '@prisma/client';

@Injectable()
export class DiagnosisFoodRelationService {
  constructor(private prisma: PrismaService) {}

  async createRelation(data: Prisma.DiagnosisFoodRelationCreateInput): Promise<DiagnosisFoodRelation & { diagnosis: any; food: any }> {
    return await this.prisma.diagnosisFoodRelation.create({
      data,
      include: {
        diagnosis: true,
        food: true,
      },
    });
  }

  async findAllRelations(): Promise<DiagnosisFoodRelation[]> {
    return await this.prisma.diagnosisFoodRelation.findMany({
      include: {
        diagnosis: true,
        food: true,
      },
    });
  }

  async findRelationsByDiagnosis(diagnosisId: number): Promise<DiagnosisFoodRelation[]> {
    return await this.prisma.diagnosisFoodRelation.findMany({
      where: { diagnosisId },
      include: {
        diagnosis: true,
        food: true,
      },
    });
  }

  async findRelationsByFood(foodId: number): Promise<DiagnosisFoodRelation[]> {
    return await this.prisma.diagnosisFoodRelation.findMany({
      where: { foodId },
      include: {
        diagnosis: true,
        food: true,
      },
    });
  }

  async findAllowedFoodsByDiagnosis(diagnosisId: number): Promise<DiagnosisFoodRelation[]> {
    return await this.prisma.diagnosisFoodRelation.findMany({
      where: { 
        diagnosisId,
        allowed: true,
      },
      include: {
        diagnosis: true,
        food: true,
      },
    });
  }

  async findProhibitedFoodsByDiagnosis(diagnosisId: number): Promise<DiagnosisFoodRelation[]> {
    return await this.prisma.diagnosisFoodRelation.findMany({
      where: { 
        diagnosisId,
        allowed: false,
      },
      include: {
        diagnosis: true,
        food: true,
      },
    });
  }

  async updateRelation(
    diagnosisId: number,
    foodId: number,
    data: Prisma.DiagnosisFoodRelationUpdateInput,
  ): Promise<DiagnosisFoodRelation & { diagnosis: any; food: any }> {
    return await this.prisma.diagnosisFoodRelation.update({
      where: {
        diagnosisId_foodId: {
          diagnosisId,
          foodId,
        },
      },
      data,
      include: {
        diagnosis: true,
        food: true,
      },
    });
  }

  async deleteRelation(diagnosisId: number, foodId: number): Promise<DiagnosisFoodRelation & { diagnosis: any; food: any }> {
    return await this.prisma.diagnosisFoodRelation.delete({
      where: {
        diagnosisId_foodId: {
          diagnosisId,
          foodId,
        },
      },
      include: {
        diagnosis: true,
        food: true,
      },
    });
  }
}
