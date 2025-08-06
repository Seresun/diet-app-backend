import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { DiagnosisFoodRelationService } from './diagnosis-food-relation.service';
import { DiagnosisFoodRelation, Prisma } from '@prisma/client';

@Controller('diagnosis-food-relations')
export class DiagnosisFoodRelationController {
  constructor(private readonly relationService: DiagnosisFoodRelationService) {}

  @Get()
  async getAllRelations(): Promise<DiagnosisFoodRelation[]> {
    return await this.relationService.findAllRelations();
  }

  @Get('diagnosis/:diagnosisId')
  async getRelationsByDiagnosis(@Param('diagnosisId') diagnosisId: string): Promise<DiagnosisFoodRelation[]> {
    return await this.relationService.findRelationsByDiagnosis(parseInt(diagnosisId));
  }

  @Get('food/:foodId')
  async getRelationsByFood(@Param('foodId') foodId: string): Promise<DiagnosisFoodRelation[]> {
    return await this.relationService.findRelationsByFood(parseInt(foodId));
  }

  @Get('diagnosis/:diagnosisId/allowed')
  async getAllowedFoodsByDiagnosis(@Param('diagnosisId') diagnosisId: string): Promise<DiagnosisFoodRelation[]> {
    return await this.relationService.findAllowedFoodsByDiagnosis(parseInt(diagnosisId));
  }

  @Get('diagnosis/:diagnosisId/prohibited')
  async getProhibitedFoodsByDiagnosis(@Param('diagnosisId') diagnosisId: string): Promise<DiagnosisFoodRelation[]> {
    return await this.relationService.findProhibitedFoodsByDiagnosis(parseInt(diagnosisId));
  }

  @Post()
  async createRelation(@Body() createRelationDto: Prisma.DiagnosisFoodRelationCreateInput): Promise<DiagnosisFoodRelation> {
    return await this.relationService.createRelation(createRelationDto);
  }

  @Put(':diagnosisId/:foodId')
  async updateRelation(
    @Param('diagnosisId') diagnosisId: string,
    @Param('foodId') foodId: string,
    @Body() updateRelationDto: Prisma.DiagnosisFoodRelationUpdateInput,
  ): Promise<DiagnosisFoodRelation> {
    return await this.relationService.updateRelation(
      parseInt(diagnosisId),
      parseInt(foodId),
      updateRelationDto,
    );
  }

  @Delete(':diagnosisId/:foodId')
  async deleteRelation(
    @Param('diagnosisId') diagnosisId: string,
    @Param('foodId') foodId: string,
  ): Promise<DiagnosisFoodRelation> {
    return await this.relationService.deleteRelation(parseInt(diagnosisId), parseInt(foodId));
  }
}
