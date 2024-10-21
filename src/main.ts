import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
// const cookieParser = require('cookie-parser');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.use(cookieParser());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'],
  });
  await app.listen(process.env.PORT);
}
bootstrap();
