import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ 
    summary: 'Проверка здоровья API',
    description: 'Возвращает статус работы API'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API работает корректно',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok'
        },
        message: {
          type: 'string',
          example: 'API is running'
        },
        timestamp: {
          type: 'string',
          example: '2024-01-01T00:00:00.000Z'
        }
      }
    }
  })
  getHealth(): { status: string; message: string; timestamp: string } {
    return {
      status: 'ok',
      message: 'API is running',
      timestamp: new Date().toISOString()
    };
  }

  @Get()
  @ApiOperation({ 
    summary: 'Корневой эндпоинт',
    description: 'Возвращает приветственное сообщение'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Приветственное сообщение',
    schema: {
      type: 'string',
      example: 'Welcome to Diet API v1'
    }
  })
  getHello(): string {
    return 'Welcome to Diet API v1';
  }
}
