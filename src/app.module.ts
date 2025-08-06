import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiagnosisService } from './diagnosis.service';
import { FoodService } from './food.service';
import { DailyPlanService } from './daily-plan.service';
import { DiagnosisFoodRelationService } from './diagnosis-food-relation.service';
import { PrismaService } from './prisma.service';
import { DiagnosisController } from './diagnosis.controller';
import { FoodController } from './food.controller';
import { DailyPlanController } from './daily-plan.controller';
import { DiagnosisFoodRelationController } from './diagnosis-food-relation.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    DiagnosisController,
    FoodController,
    DailyPlanController,
    DiagnosisFoodRelationController,
  ],
  providers: [
    AppService,
    DiagnosisService,
    FoodService,
    DailyPlanService,
    DiagnosisFoodRelationService,
    PrismaService,
  ],
})
export class AppModule {}
