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
  ApiBody,
  ApiQuery 
} from '@nestjs/swagger';
import { DiagnosisService } from './diagnosis.service';
import { Diagnosis, Prisma } from '@prisma/client';
import {
  DiagnosisResponseDto,
  CreateDiagnosisDto,
  UpdateDiagnosisDto,
} from './dto/diagnosis.dto';
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
  NotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
} from './dto/error.dto';

@ApiTags('Diagnoses')
@Controller('diagnoses')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Получить все диагнозы',
    description: 'Возвращает список всех диагнозов с их продуктами и дневными планами'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список диагнозов успешно получен',
    type: [DiagnosisResponseDto]
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async getAllDiagnoses(): Promise<DiagnosisResponseDto[]> {
    const diagnoses = await this.diagnosisService.findAllDiagnoses();
    return diagnoses.map(diagnosis => ({
      id: diagnosis.id,
      code: diagnosis.code,
      description: diagnosis.description || '',
      recommendedCalories: {
        min: diagnosis.recommendedMinKcal || 0,
        max: diagnosis.recommendedMaxKcal || 0,
        unit: 'kcal',
      },
      foods: diagnosis.foods || [],
      dailyPlans: diagnosis.dailyPlans || [],
    }));
  }

  @Get('categories')
  @ApiOperation({ 
    summary: 'Получить категории диагнозов',
    description: 'Возвращает список уникальных категорий диагнозов'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Категории диагнозов успешно получены',
    schema: {
      type: 'array',
      items: {
        type: 'string',
        example: 'balanced_diet_general'
      }
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async getDiagnosisCategories(): Promise<string[]> {
    const diagnoses = await this.diagnosisService.findAllDiagnoses();
    return [...new Set(diagnoses.map(d => d.code.split('_')[0]))];
  }

  @Get(':code')
  @ApiOperation({ 
    summary: 'Получить диагноз по коду',
    description: 'Возвращает диагноз по его коду с продуктами и дневными планами'
  })
  @ApiParam({ 
    name: 'code', 
    description: 'Код диагноза',
    example: 'balanced_diet_general'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Диагноз успешно найден',
    type: DiagnosisResponseDto
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
        unit: 'kcal',
      },
      foods: diagnosis.foods || [],
      dailyPlans: diagnosis.dailyPlans || [],
    };
  }

  @Get('id/:id')
  @ApiOperation({ 
    summary: 'Получить диагноз по ID',
    description: 'Возвращает диагноз по его ID с продуктами и дневными планами'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID диагноза',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Диагноз успешно найден',
    type: DiagnosisResponseDto
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
        unit: 'kcal',
      },
      foods: diagnosis.foods || [],
      dailyPlans: diagnosis.dailyPlans || [],
    };
  }

  @Post()
  @ApiOperation({ 
    summary: 'Создать новый диагноз',
    description: 'Создаёт новый диагноз с указанными параметрами'
  })
  @ApiBody({ 
    type: CreateDiagnosisDto,
    description: 'Данные для создания диагноза'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Диагноз успешно создан',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        code: { type: 'string' },
        description: { type: 'string' },
        recommendedMinKcal: { type: 'number' },
        recommendedMaxKcal: { type: 'number' }
      }
    }
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
  async createDiagnosis(
    @Body() createDiagnosisDto: CreateDiagnosisDto,
  ): Promise<Diagnosis> {
    return await this.diagnosisService.createDiagnosis(createDiagnosisDto);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Обновить диагноз',
    description: 'Обновляет существующий диагноз по ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID диагноза',
    example: 1
  })
  @ApiBody({ 
    type: UpdateDiagnosisDto,
    description: 'Данные для обновления диагноза'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Диагноз успешно обновлён',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        code: { type: 'string' },
        description: { type: 'string' },
        recommendedMinKcal: { type: 'number' },
        recommendedMaxKcal: { type: 'number' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Некорректные данные',
    type: ValidationErrorResponseDto
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
  async updateDiagnosis(
    @Param('id') id: string,
    @Body() updateDiagnosisDto: UpdateDiagnosisDto,
  ): Promise<Diagnosis> {
    return await this.diagnosisService.updateDiagnosis(
      parseInt(id),
      updateDiagnosisDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Удалить диагноз',
    description: 'Удаляет диагноз по ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID диагноза',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Диагноз успешно удалён',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        code: { type: 'string' },
        description: { type: 'string' },
        recommendedMinKcal: { type: 'number' },
        recommendedMaxKcal: { type: 'number' }
      }
    }
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
  async deleteDiagnosis(@Param('id') id: string): Promise<Diagnosis> {
    return await this.diagnosisService.deleteDiagnosis(parseInt(id));
  }
}
