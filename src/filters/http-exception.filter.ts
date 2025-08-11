import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { createErrorResponse } from '../constants/error-codes';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      
      // Обработка ошибок валидации
      if (status === HttpStatus.BAD_REQUEST) {
        if (Array.isArray(exceptionResponse.message)) {
          errorCode = 'VALIDATION_ERROR';
          message = 'Validation failed';
        } else {
          errorCode = 'BAD_REQUEST';
          message = exceptionResponse.message || 'Bad request';
        }
      }
      // Обработка ошибок "не найдено"
      else if (status === HttpStatus.NOT_FOUND) {
        errorCode = 'NOT_FOUND';
        message = exceptionResponse.message || 'Resource not found';
      }
      // Обработка конфликтов
      else if (status === HttpStatus.CONFLICT) {
        errorCode = 'CONFLICT';
        message = exceptionResponse.message || 'Conflict';
      }
      // Обработка других HTTP ошибок
      else {
        errorCode = `HTTP_${status}`;
        message = exceptionResponse.message || exception.message;
      }
    } else if (exception instanceof Error) {
      // Обработка ошибок Prisma
      if (exception.message.includes('Unique constraint')) {
        status = HttpStatus.CONFLICT;
        errorCode = 'DUPLICATE_CODE';
        message = 'Resource already exists';
      } else if (exception.message.includes('Record to update not found')) {
        status = HttpStatus.NOT_FOUND;
        errorCode = 'NOT_FOUND';
        message = 'Resource not found';
      } else if (exception.message.includes('Database')) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorCode = 'DATABASE_ERROR';
        message = 'Database error occurred';
      }
    }

    const errorResponse = createErrorResponse(
      status,
      errorCode,
      message,
      {
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
      }
    );

    response.status(status).json(errorResponse);
  }
}
