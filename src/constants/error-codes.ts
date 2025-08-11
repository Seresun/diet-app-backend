/**
 * Коды ошибок API
 * 
 * Этот файл содержит все возможные коды ошибок, которые может вернуть API,
 * с их описаниями и рекомендациями по исправлению.
 */

export const ERROR_CODES = {
  // 400 - Bad Request
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Ошибка валидации данных',
    description: 'Отправленные данные не соответствуют ожидаемому формату',
    examples: [
      'code must be a string',
      'description must be a string',
      'recommendedMinKcal must be a number',
      'allowed must be a boolean'
    ]
  },
  INVALID_ID: {
    code: 'INVALID_ID',
    message: 'Некорректный ID',
    description: 'ID должен быть положительным целым числом'
  },
  INVALID_FOOD_TYPE: {
    code: 'INVALID_FOOD_TYPE',
    message: 'Некорректный тип продукта',
    description: 'Тип продукта должен быть одним из: ALLOWED, PROHIBITED'
  },
  DUPLICATE_CODE: {
    code: 'DUPLICATE_CODE',
    message: 'Дублирование кода',
    description: 'Код уже существует в системе'
  },

  // 404 - Not Found
  DIAGNOSIS_NOT_FOUND: {
    code: 'DIAGNOSIS_NOT_FOUND',
    message: 'Диагноз не найден',
    description: 'Диагноз с указанным ID или кодом не существует'
  },
  FOOD_NOT_FOUND: {
    code: 'FOOD_NOT_FOUND',
    message: 'Продукт не найден',
    description: 'Продукт с указанным ID или кодом не существует'
  },
  DAILY_PLAN_NOT_FOUND: {
    code: 'DAILY_PLAN_NOT_FOUND',
    message: 'Дневной план не найден',
    description: 'Дневной план с указанным ID не существует'
  },
  RELATION_NOT_FOUND: {
    code: 'RELATION_NOT_FOUND',
    message: 'Связь не найдена',
    description: 'Связь между диагнозом и продуктом не существует'
  },

  // 409 - Conflict
  RELATION_EXISTS: {
    code: 'RELATION_EXISTS',
    message: 'Связь уже существует',
    description: 'Связь между указанным диагнозом и продуктом уже существует'
  },

  // 500 - Internal Server Error
  DATABASE_ERROR: {
    code: 'DATABASE_ERROR',
    message: 'Ошибка базы данных',
    description: 'Произошла ошибка при работе с базой данных'
  },
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Внутренняя ошибка сервера',
    description: 'Произошла непредвиденная ошибка на сервере'
  },
  SERVICE_UNAVAILABLE: {
    code: 'SERVICE_UNAVAILABLE',
    message: 'Сервис недоступен',
    description: 'Сервис временно недоступен, попробуйте позже'
  }
};

/**
 * Получить описание ошибки по коду
 */
export function getErrorDescription(errorCode: string) {
  return ERROR_CODES[errorCode] || {
    code: 'UNKNOWN_ERROR',
    message: 'Неизвестная ошибка',
    description: 'Произошла неизвестная ошибка'
  };
}

/**
 * Создать объект ошибки для ответа API
 */
export function createErrorResponse(
  statusCode: number,
  errorCode: string,
  message?: string,
  details?: any
) {
  const errorInfo = getErrorDescription(errorCode);
  
  return {
    statusCode,
    error: errorInfo.code,
    message: message || errorInfo.message,
    description: errorInfo.description,
    timestamp: new Date().toISOString(),
    ...(details && { details })
  };
}
