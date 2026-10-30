import { NestFactory } from '@nestjs/core';
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

    app.enableCors();

    await app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
