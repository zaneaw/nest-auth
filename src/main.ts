import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { logger } from './common/middleware/logger.middleware';
// import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(logger);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // app.use(
  //   session({
  //     secret: 'my-secret',
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: {
  //       secure: process.env.NODE_ENV === 'production',
  //       maxAge:
  //         process.env.NODE_ENV === 'production'
  //           ? 1000 * 60 * 60 * 24 * 30 // 30 days
  //           : 1000 * 60 * 5, // 5 minutes
  //     },
  //   }),
  // );

  await app.listen(3333);
}
bootstrap();
