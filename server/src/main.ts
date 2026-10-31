import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser = require('cookie-parser');
import * as fs from 'fs';
import { AppModule } from './app.module';

const start = async () => {
  try {
    // Локальный запуск без docker: берём переменные из .env (уже заданные не перезаписываются)
    if (fs.existsSync('.env')) {
      process.loadEnvFile('.env');
    }

    const PORT = process.env.PORT || 5000;

    const app = await NestFactory.create(AppModule);

    (app.getHttpAdapter().getInstance() as any).set('trust proxy', true);

    app.use(cookieParser());

    // Проверка DTO с декораторами class-validator; ошибки отдаются первым сообщением
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        stopAtFirstError: true,
      }),
    );

    // Сессия в cookie, поэтому нужен credentials и явный список источников
    const origins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
    app.enableCors({ origin: origins, credentials: true });

    await app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
