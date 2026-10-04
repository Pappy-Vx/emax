import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix — all routes are /api/v1/...
  app.setGlobalPrefix('api/v1');

  // Global request/response logger — every endpoint appears in Render logs
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global error handler — clean messages to client, full stack to Render logs
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Validate and strip unknown fields on every incoming request body
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      stopAtFirstError: true,   // send one message at a time instead of every error at once
    }),
  );

  // CORS — allow the Next.js frontend origin(s)
  const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const port = parseInt(process.env.PORT ?? '3001', 10);
  await app.listen(port, '0.0.0.0');
  console.log(`eMax API running on port ${port}`);
}

bootstrap();
