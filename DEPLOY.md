# Деплой бэкенда на Render

## 📋 Данные для деплоя

### **1. Информация о проекте:**
- **Название:** diet-backend
- **Тип:** Web Service
- **Язык:** Node.js
- **Фреймворк:** NestJS
- **База данных:** PostgreSQL

### **2. Настройки для Render:**

#### **Build Command:**
```bash
npm install && npx prisma generate && npm run build
```

#### **Start Command:**
```bash
npm run start:prod
```

#### **Environment Variables:**
- `NODE_ENV`: `production`
- `DATABASE_URL`: (автоматически из базы данных)
- `FRONTEND_URL`: `https://diet-app-rho.vercel.app`
- `PORT`: (автоматически от Render)

### **3. База данных:**
- **Тип:** PostgreSQL
- **Название:** diet-database
- **База данных:** diet_db
- **Пользователь:** diet_user

### **4. Health Check:**
- **Path:** `/api`
- **Ожидаемый ответ:** `"Hello World!"`

## 🚀 Пошаговая инструкция деплоя

### **Шаг 1: Создание сервиса**
1. Зайдите на [render.com](https://render.com)
2. Нажмите "New +" → "Web Service"
3. Подключите ваш GitHub репозиторий

### **Шаг 2: Настройка сервиса**
- **Name:** `diet-backend`
- **Environment:** `Node`
- **Region:** Выберите ближайший к вам
- **Branch:** `main`

### **Шаг 3: Настройка базы данных**
1. Создайте новую PostgreSQL базу данных
2. Название: `diet-database`
3. Скопируйте `DATABASE_URL` в переменные окружения

### **Шаг 4: Переменные окружения**
Добавьте следующие переменные:
```
NODE_ENV=production
FRONTEND_URL=https://diet-app-rho.vercel.app
```

### **Шаг 5: Деплой**
1. Нажмите "Create Web Service"
2. Дождитесь завершения сборки
3. Проверьте, что сервис запустился

## 🔧 Проверка деплоя

### **API Endpoints:**
- **Основной:** `https://your-app-name.onrender.com/api`
- **Диагнозы:** `https://your-app-name.onrender.com/api/diagnoses`
- **План питания:** `https://your-app-name.onrender.com/api/daily-plan/id/1`

### **Ожидаемые ответы:**
```json
{
  "id": 1,
  "code": "balanced_diet_general",
  "recommendedCalories": {
    "min": 2000,
    "max": 2200,
    "unit": "kcal"
  },
  "allowedFoods": [...],
  "prohibitedFoods": [...],
  "dailyPlan": [...]
}
```

## 📝 Важные замечания

1. **База данных:** После деплоя нужно запустить миграции:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

2. **CORS:** Настроен для фронтенда на `https://diet-app-rho.vercel.app`

3. **Порт:** Приложение использует порт из переменной окружения `PORT`

4. **Логи:** Доступны в панели управления Render

## 🔗 Полезные ссылки

- [Render Documentation](https://render.com/docs)
- [NestJS Documentation](https://nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
