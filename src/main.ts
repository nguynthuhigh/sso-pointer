import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: '*',
  });
  await app.listen(process.env.PORT);
}
bootstrap();
