import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP статус код' })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request', description: 'Сообщение об ошибке' })
  message: string;

  @ApiProperty({ example: 'Bad Request', description: 'Тип ошибки' })
  error: string;

  @ApiProperty({ example: '/api/v1/diagnoses', description: 'Путь запроса' })
  path?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Время ошибки' })
  timestamp?: string;
}

export class ValidationErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP статус код' })
  statusCode: number;

  @ApiProperty({ 
    example: ['code must be a string', 'description must be a string'], 
    description: 'Массив ошибок валидации' 
  })
  message: string[];

  @ApiProperty({ example: 'Bad Request', description: 'Тип ошибки' })
  error: string;
}

export class NotFoundErrorResponseDto {
  @ApiProperty({ example: 404, description: 'HTTP статус код' })
  statusCode: number;

  @ApiProperty({ example: 'Diagnosis not found', description: 'Сообщение об ошибке' })
  message: string;

  @ApiProperty({ example: 'Not Found', description: 'Тип ошибки' })
  error: string;
}

export class InternalServerErrorResponseDto {
  @ApiProperty({ example: 500, description: 'HTTP статус код' })
  statusCode: number;

  @ApiProperty({ example: 'Internal server error', description: 'Сообщение об ошибке' })
  message: string;

  @ApiProperty({ example: 'Internal Server Error', description: 'Тип ошибки' })
  error: string;
}
