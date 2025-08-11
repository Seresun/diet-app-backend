import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';

declare const process: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка глобального префикса для API
  app.setGlobalPrefix('api');

  // Настройка валидации
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Настройка глобального фильтра исключений
  app.useGlobalFilters(new HttpExceptionFilter());

  // Настройка CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Настройка Swagger документации
  const config = new DocumentBuilder()
    .setTitle('Diet API')
    .setDescription(`
      API для управления диетическими планами и рекомендациями.
      
      ## Описание
      Этот API предоставляет функциональность для:
      - Управления диагнозами и диетическими рекомендациями
      - Управления продуктами питания
      - Создания и управления дневными планами питания
      - Установления связей между диагнозами и продуктами
      
      ## Версионирование
      API использует базовый префикс: \`/api/\`
      
      ## Коды ошибок
      - **400** - Некорректные данные запроса
      - **404** - Ресурс не найден
      - **500** - Внутренняя ошибка сервера
      
      ## Аутентификация
      В текущей версии API не требует аутентификации.
    `)
    .setVersion('1.0')
    .addTag('Health', 'Эндпоинты для проверки состояния API')
    .addTag('Diagnoses', 'Управление диагнозами и диетическими рекомендациями')
    .addTag('Foods', 'Управление продуктами питания')
    .addTag('Daily Plans', 'Управление дневными планами питания')
    .addTag('Diagnosis-Food Relations', 'Управление связями между диагнозами и продуктами')
    .addServer('http://localhost:3000', 'Локальная среда разработки')
    .addServer('https://your-production-domain.com', 'Продакшн среда')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Настройка Swagger UI
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        activated: true,
        theme: 'monokai'
      }
    },
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3b4151; font-size: 36px; }
      .swagger-ui .info .description { font-size: 16px; line-height: 1.5; }
      .swagger-ui .scheme-container { background: #f7f7f7; padding: 20px; margin: 20px 0; }
    `,
    customSiteTitle: 'Diet API Documentation',
    customfavIcon: '/favicon.ico',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();
