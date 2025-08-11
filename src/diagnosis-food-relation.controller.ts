import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
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
import { DiagnosisFoodRelationService } from './diagnosis-food-relation.service';
import { DiagnosisFoodRelation, Prisma } from '@prisma/client';
import {
  DiagnosisFoodRelationResponseDto,
  CreateDiagnosisFoodRelationDto,
  UpdateDiagnosisFoodRelationDto,
} from './dto/diagnosis-food-relation.dto';
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
  NotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
} from './dto/error.dto';

@ApiTags('Diagnosis-Food Relations')
@Controller('diagnosis-food-relations')
export class DiagnosisFoodRelationController {
  constructor(private readonly relationService: DiagnosisFoodRelationService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Получить все связи диагноз-продукт',
    description: 'Возвращает список всех связей между диагнозами и продуктами'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список связей успешно получен',
    type: [DiagnosisFoodRelationResponseDto]
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async getAllRelations(): Promise<DiagnosisFoodRelationResponseDto[]> {
    const relations = await this.relationService.findAllRelations();
    return relations as DiagnosisFoodRelationResponseDto[];
  }

  @Get('diagnosis/:diagnosisId')
  @ApiOperation({ 
    summary: 'Получить связи по диагнозу',
    description: 'Возвращает все связи для конкретного диагноза'
  })
  @ApiParam({ 
    name: 'diagnosisId', 
    description: 'ID диагноза',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Связи для диагноза успешно получены',
    type: [DiagnosisFoodRelationResponseDto]
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async getRelationsByDiagnosis(@Param('diagnosisId') diagnosisId: string): Promise<DiagnosisFoodRelationResponseDto[]> {
    const relations = await this.relationService.findRelationsByDiagnosis(parseInt(diagnosisId));
    return relations as DiagnosisFoodRelationResponseDto[];
  }

  @Get('food/:foodId')
  @ApiOperation({ 
    summary: 'Получить связи по продукту',
    description: 'Возвращает все связи для конкретного продукта'
  })
  @ApiParam({ 
    name: 'foodId', 
    description: 'ID продукта',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Связи для продукта успешно получены',
    type: [DiagnosisFoodRelationResponseDto]
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async getRelationsByFood(@Param('foodId') foodId: string): Promise<DiagnosisFoodRelationResponseDto[]> {
    const relations = await this.relationService.findRelationsByFood(parseInt(foodId));
    return relations as DiagnosisFoodRelationResponseDto[];
  }

  @Get('diagnosis/:diagnosisId/allowed')
  @ApiOperation({ 
    summary: 'Получить разрешённые продукты для диагноза',
    description: 'Возвращает все разрешённые продукты для конкретного диагноза'
  })
  @ApiParam({ 
    name: 'diagnosisId', 
    description: 'ID диагноза',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Разрешённые продукты успешно получены',
    type: [DiagnosisFoodRelationResponseDto]
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async getAllowedFoodsByDiagnosis(@Param('diagnosisId') diagnosisId: string): Promise<DiagnosisFoodRelationResponseDto[]> {
    const relations = await this.relationService.findAllowedFoodsByDiagnosis(parseInt(diagnosisId));
    return relations as DiagnosisFoodRelationResponseDto[];
  }

  @Get('diagnosis/:diagnosisId/prohibited')
  @ApiOperation({ 
    summary: 'Получить запрещённые продукты для диагноза',
    description: 'Возвращает все запрещённые продукты для конкретного диагноза'
  })
  @ApiParam({ 
    name: 'diagnosisId', 
    description: 'ID диагноза',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Запрещённые продукты успешно получены',
    type: [DiagnosisFoodRelationResponseDto]
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async getProhibitedFoodsByDiagnosis(@Param('diagnosisId') diagnosisId: string): Promise<DiagnosisFoodRelationResponseDto[]> {
    const relations = await this.relationService.findProhibitedFoodsByDiagnosis(parseInt(diagnosisId));
    return relations as DiagnosisFoodRelationResponseDto[];
  }

  @Post()
  @ApiOperation({ 
    summary: 'Создать связь диагноз-продукт',
    description: 'Создаёт новую связь между диагнозом и продуктом'
  })
  @ApiBody({ 
    type: CreateDiagnosisFoodRelationDto,
    description: 'Данные для создания связи'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Связь успешно создана',
    type: DiagnosisFoodRelationResponseDto
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
  async createRelation(@Body() createRelationDto: CreateDiagnosisFoodRelationDto): Promise<DiagnosisFoodRelationResponseDto> {
    return await this.relationService.createRelation({
      ...createRelationDto,
      diagnosis: {
        connect: { id: createRelationDto.diagnosisId }
      },
      food: {
        connect: { id: createRelationDto.foodId }
      }
    });
  }

  @Put(':diagnosisId/:foodId')
  @ApiOperation({ 
    summary: 'Обновить связь диагноз-продукт',
    description: 'Обновляет существующую связь между диагнозом и продуктом'
  })
  @ApiParam({ 
    name: 'diagnosisId', 
    description: 'ID диагноза',
    example: 1
  })
  @ApiParam({ 
    name: 'foodId', 
    description: 'ID продукта',
    example: 1
  })
  @ApiBody({ 
    type: UpdateDiagnosisFoodRelationDto,
    description: 'Данные для обновления связи'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Связь успешно обновлена',
    type: DiagnosisFoodRelationResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Некорректные данные',
    type: ValidationErrorResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Связь не найдена',
    type: NotFoundErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async updateRelation(
    @Param('diagnosisId') diagnosisId: string,
    @Param('foodId') foodId: string,
    @Body() updateRelationDto: UpdateDiagnosisFoodRelationDto,
  ): Promise<DiagnosisFoodRelationResponseDto> {
    return await this.relationService.updateRelation(
      parseInt(diagnosisId),
      parseInt(foodId),
      updateRelationDto,
    );
  }

  @Delete(':diagnosisId/:foodId')
  @ApiOperation({ 
    summary: 'Удалить связь диагноз-продукт',
    description: 'Удаляет связь между диагнозом и продуктом'
  })
  @ApiParam({ 
    name: 'diagnosisId', 
    description: 'ID диагноза',
    example: 1
  })
  @ApiParam({ 
    name: 'foodId', 
    description: 'ID продукта',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Связь успешно удалена',
    type: DiagnosisFoodRelationResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Связь не найдена',
    type: NotFoundErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async deleteRelation(
    @Param('diagnosisId') diagnosisId: string,
    @Param('foodId') foodId: string,
  ): Promise<DiagnosisFoodRelationResponseDto> {
    return await this.relationService.deleteRelation(parseInt(diagnosisId), parseInt(foodId));
  }
}
