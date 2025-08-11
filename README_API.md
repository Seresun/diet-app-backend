# Diet API Documentation

## Обзор

Diet API - это RESTful API для управления диетическими планами и рекомендациями. API предоставляет функциональность для работы с диагнозами, продуктами питания, дневными планами и связями между ними.

## Версионирование

API использует версионирование через URL: `/api/v1/`

## Базовый URL

- **Локальная среда**: `http://localhost:3000/api/v1`
- **Продакшн**: `https://your-production-domain.com/api/v1`

## Swagger UI

Интерактивная документация доступна по адресу: `/api/docs`

## Аутентификация

В текущей версии API не требует аутентификации.

## Структура ответов

### Успешный ответ

```json
{
  "id": 1,
  "code": "balanced_diet_general",
  "description": "Сбалансированная диета для общего здоровья",
  "recommendedCalories": {
    "min": 1800,
    "max": 2200,
    "unit": "kcal"
  }
}
```

### Ответ с ошибкой

```json
{
  "statusCode": 404,
  "error": "NOT_FOUND",
  "message": "Resource not found",
  "description": "Запрашиваемый ресурс не найден",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "details": {
    "path": "/api/v1/diagnoses/999",
    "method": "GET"
  }
}
```

## Коды ошибок

### 400 - Bad Request
- `VALIDATION_ERROR` - Ошибка валидации данных
- `INVALID_ID` - Некорректный ID
- `INVALID_FOOD_TYPE` - Некорректный тип продукта
- `DUPLICATE_CODE` - Дублирование кода

### 404 - Not Found
- `DIAGNOSIS_NOT_FOUND` - Диагноз не найден
- `FOOD_NOT_FOUND` - Продукт не найден
- `DAILY_PLAN_NOT_FOUND` - Дневной план не найден
- `RELATION_NOT_FOUND` - Связь не найдена

### 409 - Conflict
- `RELATION_EXISTS` - Связь уже существует

### 500 - Internal Server Error
- `DATABASE_ERROR` - Ошибка базы данных
- `INTERNAL_SERVER_ERROR` - Внутренняя ошибка сервера
- `SERVICE_UNAVAILABLE` - Сервис недоступен

## Эндпоинты

### Health Check

#### GET /api/v1/health
Проверка состояния API.

**Ответ:**
```json
{
  "status": "ok",
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Диагнозы

#### GET /api/v1/diagnoses
Получить все диагнозы.

**Ответ:** Массив объектов `DiagnosisResponseDto`

#### GET /api/v1/diagnoses/categories
Получить категории диагнозов.

**Ответ:** Массив строк с названиями категорий

#### GET /api/v1/diagnoses/{code}
Получить диагноз по коду.

**Параметры:**
- `code` (string) - Код диагноза

**Ответ:** `DiagnosisResponseDto`

#### GET /api/v1/diagnoses/id/{id}
Получить диагноз по ID.

**Параметры:**
- `id` (number) - ID диагноза

**Ответ:** `DiagnosisResponseDto`

#### POST /api/v1/diagnoses
Создать новый диагноз.

**Тело запроса:** `CreateDiagnosisDto`

**Ответ:** `Diagnosis`

#### PUT /api/v1/diagnoses/{id}
Обновить диагноз.

**Параметры:**
- `id` (number) - ID диагноза

**Тело запроса:** `UpdateDiagnosisDto`

**Ответ:** `Diagnosis`

#### DELETE /api/v1/diagnoses/{id}
Удалить диагноз.

**Параметры:**
- `id` (number) - ID диагноза

**Ответ:** `Diagnosis`

### Продукты

#### GET /api/v1/foods
Получить все продукты.

**Query параметры:**
- `type` (optional) - Тип продукта (ALLOWED/PROHIBITED)

**Ответ:** Массив объектов `FoodResponseDto`

#### GET /api/v1/foods/code/{code}
Получить продукт по коду.

**Параметры:**
- `code` (string) - Код продукта

**Ответ:** `FoodResponseDto`

#### GET /api/v1/foods/{id}
Получить продукт по ID.

**Параметры:**
- `id` (number) - ID продукта

**Ответ:** `FoodResponseDto`

#### POST /api/v1/foods
Создать новый продукт.

**Тело запроса:** `CreateFoodDto`

**Ответ:** `FoodResponseDto`

#### PUT /api/v1/foods/{id}
Обновить продукт.

**Параметры:**
- `id` (number) - ID продукта

**Тело запроса:** `UpdateFoodDto`

**Ответ:** `FoodResponseDto`

#### DELETE /api/v1/foods/{id}
Удалить продукт.

**Параметры:**
- `id` (number) - ID продукта

**Ответ:** `FoodResponseDto`

### Дневные планы

#### GET /api/v1/daily-plan
Получить все дневные планы.

**Ответ:** Массив объектов `DailyPlanWithIngredientsDto`

#### GET /api/v1/daily-plan/{diagnosisId}
Получить дневной план по ID диагноза.

**Параметры:**
- `diagnosisId` (number) - ID диагноза

**Ответ:** `DailyPlanResponseDto`

#### GET /api/v1/daily-plan/id/{id}
Получить дневной план по ID.

**Параметры:**
- `id` (number) - ID диагноза

**Ответ:** `DailyPlanResponseDto`

#### POST /api/v1/daily-plan
Создать новый дневной план.

**Тело запроса:** `CreateDailyPlanDto`

**Ответ:** `DailyPlanWithIngredientsDto`

#### POST /api/v1/daily-plan/with-ingredients
Создать дневной план с ингредиентами.

**Тело запроса:** `CreateDailyPlanWithIngredientsDto`

**Ответ:** `DailyPlanWithIngredientsDto`

#### PUT /api/v1/daily-plan/{id}
Обновить дневной план.

**Параметры:**
- `id` (number) - ID дневного плана

**Тело запроса:** `UpdateDailyPlanDto`

**Ответ:** `DailyPlanWithIngredientsDto`

#### DELETE /api/v1/daily-plan/{id}
Удалить дневной план.

**Параметры:**
- `id` (number) - ID дневного плана

**Ответ:** `DailyPlan`

### Связи диагноз-продукт

#### GET /api/v1/diagnosis-food-relations
Получить все связи диагноз-продукт.

**Ответ:** Массив объектов `DiagnosisFoodRelationResponseDto`

#### GET /api/v1/diagnosis-food-relations/diagnosis/{diagnosisId}
Получить связи по диагнозу.

**Параметры:**
- `diagnosisId` (number) - ID диагноза

**Ответ:** Массив объектов `DiagnosisFoodRelationResponseDto`

#### GET /api/v1/diagnosis-food-relations/food/{foodId}
Получить связи по продукту.

**Параметры:**
- `foodId` (number) - ID продукта

**Ответ:** Массив объектов `DiagnosisFoodRelationResponseDto`

#### GET /api/v1/diagnosis-food-relations/diagnosis/{diagnosisId}/allowed
Получить разрешённые продукты для диагноза.

**Параметры:**
- `diagnosisId` (number) - ID диагноза

**Ответ:** Массив объектов `DiagnosisFoodRelationResponseDto`

#### GET /api/v1/diagnosis-food-relations/diagnosis/{diagnosisId}/prohibited
Получить запрещённые продукты для диагноза.

**Параметры:**
- `diagnosisId` (number) - ID диагноза

**Ответ:** Массив объектов `DiagnosisFoodRelationResponseDto`

#### POST /api/v1/diagnosis-food-relations
Создать связь диагноз-продукт.

**Тело запроса:** `CreateDiagnosisFoodRelationDto`

**Ответ:** `DiagnosisFoodRelationResponseDto`

#### PUT /api/v1/diagnosis-food-relations/{diagnosisId}/{foodId}
Обновить связь диагноз-продукт.

**Параметры:**
- `diagnosisId` (number) - ID диагноза
- `foodId` (number) - ID продукта

**Тело запроса:** `UpdateDiagnosisFoodRelationDto`

**Ответ:** `DiagnosisFoodRelationResponseDto`

#### DELETE /api/v1/diagnosis-food-relations/{diagnosisId}/{foodId}
Удалить связь диагноз-продукт.

**Параметры:**
- `diagnosisId` (number) - ID диагноза
- `foodId` (number) - ID продукта

**Ответ:** `DiagnosisFoodRelationResponseDto`

## Модели данных

### DiagnosisResponseDto
```typescript
{
  id: number;
  code: string;
  description: string;
  recommendedCalories: {
    min: number;
    max: number;
    unit: string;
  };
  foods: FoodInDiagnosisDto[];
  dailyPlans: DailyPlanInDiagnosisDto[];
}
```

### FoodResponseDto
```typescript
{
  id: number;
  code: string;
  name: string | null;
  type: FoodType | null;
}
```

### DailyPlanResponseDto
```typescript
{
  id: number;
  code: string;
  recommendedCalories: {
    min: number | null;
    max: number | null;
    unit: string;
  };
  allowedFoods: string[];
  prohibitedFoods: string[];
  dailyPlan: DailyPlanMealDto[];
}
```

### DiagnosisFoodRelationResponseDto
```typescript
{
  diagnosisId: number;
  foodId: number;
  allowed: boolean;
  diagnosis: DiagnosisInfo;
  food: FoodInfo;
}
```

## Примеры использования

### Создание диагноза
```bash
curl -X POST http://localhost:3000/api/v1/diagnoses \
  -H "Content-Type: application/json" \
  -d '{
    "code": "diabetes_type_2",
    "description": "Диета для диабета 2 типа",
    "recommendedMinKcal": 1500,
    "recommendedMaxKcal": 2000
  }'
```

### Получение дневного плана
```bash
curl -X GET http://localhost:3000/api/v1/daily-plan/id/1
```

### Создание связи диагноз-продукт
```bash
curl -X POST http://localhost:3000/api/v1/diagnosis-food-relations \
  -H "Content-Type: application/json" \
  -d '{
    "diagnosisId": 1,
    "foodId": 1,
    "allowed": true
  }'
```

## Ограничения

- Максимальный размер запроса: 10MB
- Лимит запросов: 1000 запросов в минуту на IP
- Таймаут запроса: 30 секунд

## Поддержка

Для получения поддержки обращайтесь к команде разработки или создавайте issue в репозитории проекта.
