import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody 
} from '@nestjs/swagger';
import { DailyPlanService } from './daily-plan.service';
import { DiagnosisService } from './diagnosis.service';
import { DailyPlan, Prisma } from '@prisma/client';
import {
  DailyPlanResponseDto,
  DailyPlanWithIngredientsDto,
  CreateDailyPlanDto,
  CreateDailyPlanWithIngredientsDto,
  UpdateDailyPlanDto,
} from './dto/daily-plan.dto';
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
  NotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
} from './dto/error.dto';

@ApiTags('Daily Plans')
@Controller('daily-plan')
export class DailyPlanController {
  constructor(
    private readonly dailyPlanService: DailyPlanService,
    private readonly diagnosisService: DiagnosisService,
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Получить все дневные планы',
    description: 'Возвращает список всех дневных планов с ингредиентами'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список дневных планов успешно получен',
    type: [DailyPlanWithIngredientsDto]
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async getAllDailyPlans(): Promise<DailyPlanWithIngredientsDto[]> {
    return await this.dailyPlanService.findAllDailyPlans();
  }

  @Get(':diagnosisId')
  @ApiOperation({ 
    summary: 'Получить дневной план по ID диагноза',
    description: 'Возвращает дневной план питания для конкретного диагноза'
  })
  @ApiParam({ 
    name: 'diagnosisId', 
    description: 'ID диагноза',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Дневной план успешно найден',
    type: DailyPlanResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Диагноз не найден',
    type: NotFoundErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async getDailyPlanByDiagnosisId(@Param('diagnosisId') diagnosisId: string): Promise<DailyPlanResponseDto> {
    const diagnosis = await this.diagnosisService.findDiagnosisById(parseInt(diagnosisId));
    
    if (!diagnosis) {
      throw new NotFoundException('Diagnosis not found');
    }

    // Разделяем продукты на разрешенные и запрещенные
    const allowedFoods: string[] = [];
    const prohibitedFoods: string[] = [];

    diagnosis.foods.forEach(relation => {
      if (relation.allowed) {
        allowedFoods.push(relation.food.code);
      } else {
        prohibitedFoods.push(relation.food.code);
      }
    });

    // Формируем daily plan в нужном формате
    const dailyPlan = diagnosis.dailyPlans.map(plan => ({
      mealKey: plan.mealKey,
      ingredients: plan.ingredients.map(ingredient => ingredient.food.code),
      time: plan.time,
      nutrition: {
        calories: plan.calories,
        proteins: plan.proteins,
        fats: plan.fats,
        carbs: plan.carbs,
      },
      weight_grams: plan.weightGrams,
    }));

    // Формируем recommendedCalories
    const recommendedCalories = {
      min: diagnosis.recommendedMinKcal,
      max: diagnosis.recommendedMaxKcal,
      unit: 'kcal',
    };

    return {
      id: diagnosis.id,
      code: diagnosis.code,
      recommendedCalories,
      allowedFoods,
      prohibitedFoods,
      dailyPlan,
    };
  }

  @Get('id/:id')
  @ApiOperation({ 
    summary: 'Получить дневной план по ID',
    description: 'Возвращает дневной план питания по ID диагноза'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID диагноза',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Дневной план успешно найден',
    type: DailyPlanResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Диагноз не найден',
    type: NotFoundErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async getDailyPlanById(@Param('id') id: string): Promise<DailyPlanResponseDto> {
    const diagnosis = await this.diagnosisService.findDiagnosisById(parseInt(id));
    
    if (!diagnosis) {
      throw new NotFoundException('Diagnosis not found');
    }

    // Разделяем продукты на разрешенные и запрещенные
    const allowedFoods: string[] = [];
    const prohibitedFoods: string[] = [];

    diagnosis.foods.forEach(relation => {
      if (relation.allowed) {
        allowedFoods.push(relation.food.code);
      } else {
        prohibitedFoods.push(relation.food.code);
      }
    });

    // Формируем daily plan в полном формате
    const dailyPlan = diagnosis.dailyPlans.map(plan => ({
      mealKey: plan.mealKey,
      ingredients: plan.ingredients.map(ingredient => ingredient.food.code),
      time: plan.time,
      nutrition: {
        calories: plan.calories,
        proteins: plan.proteins,
        fats: plan.fats,
        carbs: plan.carbs,
      },
      weight_grams: plan.weightGrams,
    }));

    // Формируем recommendedCalories
    const recommendedCalories = {
      min: diagnosis.recommendedMinKcal,
      max: diagnosis.recommendedMaxKcal,
      unit: 'kcal',
    };

    return {
      id: diagnosis.id,
      code: diagnosis.code,
      recommendedCalories,
      allowedFoods,
      prohibitedFoods,
      dailyPlan,
    };
  }

  @Post()
  @ApiOperation({ 
    summary: 'Создать новый дневной план',
    description: 'Создаёт новый дневной план питания'
  })
  @ApiBody({ 
    type: CreateDailyPlanDto,
    description: 'Данные для создания дневного плана'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Дневной план успешно создан',
    type: DailyPlanWithIngredientsDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Некорректные данные',
    type: ValidationErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  @HttpCode(HttpStatus.CREATED)
  async createDailyPlan(@Body() createDto: CreateDailyPlanDto): Promise<DailyPlanWithIngredientsDto> {
    const dailyPlan = await this.dailyPlanService.createDailyPlan({
      ...createDto,
      diagnosis: {
        connect: { id: createDto.diagnosisId }
      }
    });
    return this.dailyPlanService.ensureSafeIngredients(dailyPlan);
  }

  @Post('with-ingredients')
  @ApiOperation({ 
    summary: 'Создать дневной план с ингредиентами',
    description: 'Создаёт новый дневной план питания с указанными ингредиентами'
  })
  @ApiBody({ 
    type: CreateDailyPlanWithIngredientsDto,
    description: 'Данные для создания дневного плана с ингредиентами'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Дневной план с ингредиентами успешно создан',
    type: DailyPlanWithIngredientsDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Некорректные данные',
    type: ValidationErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  @HttpCode(HttpStatus.CREATED)
  async createDailyPlanWithIngredients(
    @Body() createDto: CreateDailyPlanWithIngredientsDto,
  ): Promise<DailyPlanWithIngredientsDto> {
    const { ingredients, ...dailyPlanData } = createDto;
    const dailyPlan = await this.dailyPlanService.createDailyPlanWithIngredients(
      dailyPlanData,
      ingredients,
    );
    return this.dailyPlanService.ensureSafeIngredients(dailyPlan);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Обновить дневной план',
    description: 'Обновляет существующий дневной план по ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID дневного плана',
    example: 1
  })
  @ApiBody({ 
    type: UpdateDailyPlanDto,
    description: 'Данные для обновления дневного плана'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Дневной план успешно обновлён',
    type: DailyPlanWithIngredientsDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Некорректные данные',
    type: ValidationErrorResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Дневной план не найден',
    type: NotFoundErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async updateDailyPlan(
    @Param('id') id: string,
    @Body() updateDto: UpdateDailyPlanDto,
  ): Promise<DailyPlanWithIngredientsDto> {
    const dailyPlan = await this.dailyPlanService.updateDailyPlan(parseInt(id), updateDto);
    return this.dailyPlanService.ensureSafeIngredients(dailyPlan);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Удалить дневной план',
    description: 'Удаляет дневной план по ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID дневного плана',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Дневной план успешно удалён',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        diagnosisId: { type: 'number' },
        time: { type: 'string' },
        mealKey: { type: 'string' },
        weightGrams: { type: 'number' },
        calories: { type: 'number' },
        proteins: { type: 'number' },
        fats: { type: 'number' },
        carbs: { type: 'number' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Дневной план не найден',
    type: NotFoundErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async deleteDailyPlan(@Param('id') id: string): Promise<DailyPlan> {
    return await this.dailyPlanService.deleteDailyPlan(parseInt(id));
  }
}
