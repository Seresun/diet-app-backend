import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  Query,
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
import { FoodService } from './food.service';
import { Food, Prisma, FoodType } from '@prisma/client';
import {
  FoodResponseDto,
  CreateFoodDto,
  UpdateFoodDto,
} from './dto/food.dto';
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
  NotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
} from './dto/error.dto';

@ApiTags('Foods')
@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Получить все продукты',
    description: 'Возвращает список всех продуктов с возможностью фильтрации по типу'
  })
  @ApiQuery({ 
    name: 'type', 
    required: false, 
    enum: ['ALLOWED', 'PROHIBITED'],
    description: 'Тип продукта для фильтрации'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список продуктов успешно получен',
    type: [FoodResponseDto]
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async getAllFoods(@Query('type') type?: FoodType): Promise<FoodResponseDto[]> {
    if (type) {
      return await this.foodService.findFoodsByType(type);
    }
    return await this.foodService.findAllFoods();
  }

  @Get('code/:code')
  @ApiOperation({ 
    summary: 'Получить продукт по коду',
    description: 'Возвращает продукт по его коду'
  })
  @ApiParam({ 
    name: 'code', 
    description: 'Код продукта',
    example: 'oatmeal'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Продукт успешно найден',
    type: FoodResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Продукт не найден',
    type: NotFoundErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async getFoodByCode(@Param('code') code: string): Promise<FoodResponseDto> {
    const food = await this.foodService.findFoodByCode(code);
    if (!food) {
      throw new NotFoundException('Food not found');
    }
    return food;
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Получить продукт по ID',
    description: 'Возвращает продукт по его ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID продукта',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Продукт успешно найден',
    type: FoodResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Продукт не найден',
    type: NotFoundErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async getFoodById(@Param('id') id: string): Promise<FoodResponseDto> {
    const food = await this.foodService.findFoodById(parseInt(id));
    if (!food) {
      throw new NotFoundException('Food not found');
    }
    return food;
  }

  @Post()
  @ApiOperation({ 
    summary: 'Создать новый продукт',
    description: 'Создаёт новый продукт с указанными параметрами'
  })
  @ApiBody({ 
    type: CreateFoodDto,
    description: 'Данные для создания продукта'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Продукт успешно создан',
    type: FoodResponseDto
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
  async createFood(@Body() createFoodDto: CreateFoodDto): Promise<FoodResponseDto> {
    return await this.foodService.createFood(createFoodDto);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Обновить продукт',
    description: 'Обновляет существующий продукт по ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID продукта',
    example: 1
  })
  @ApiBody({ 
    type: UpdateFoodDto,
    description: 'Данные для обновления продукта'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Продукт успешно обновлён',
    type: FoodResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Некорректные данные',
    type: ValidationErrorResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Продукт не найден',
    type: NotFoundErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async updateFood(
    @Param('id') id: string,
    @Body() updateFoodDto: UpdateFoodDto,
  ): Promise<FoodResponseDto> {
    return await this.foodService.updateFood(parseInt(id), updateFoodDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Удалить продукт',
    description: 'Удаляет продукт по ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID продукта',
    example: 1
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Продукт успешно удалён',
    type: FoodResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Продукт не найден',
    type: NotFoundErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера',
    type: InternalServerErrorResponseDto
  })
  async deleteFood(@Param('id') id: string): Promise<FoodResponseDto> {
    return await this.foodService.deleteFood(parseInt(id));
  }
}
