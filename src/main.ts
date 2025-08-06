import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare const process: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Все API будут начинаться с /api
  app.setGlobalPrefix('api');
  
  // CORS configuration
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://diet-app-rho.vercel.app',
    'https://diet-app-frontend.onrender.com'
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
