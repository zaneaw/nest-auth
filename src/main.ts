import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
// import { PrismaSessionStore } from '@quixo3/prisma-session-store';
// import { PrismaClient } from '@prisma/client';
// import { logger } from './common/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(logger);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production', // secure if prod
        maxAge:
          process.env.NODE_ENV === 'production'
            ? 1000 * 60 * 60 * 24 * 30 // 30 days for prod
            : 1000 * 60 * 2, // 5 minutes for dev
      },
      // store: new PrismaSessionStore(new PrismaClient(), {
      //   checkPeriod:
      //     process.env.NODE_ENV === 'production'
      //       ? 1000 * 60 * 15 // 15 min for prod
      //       : 1000 * 60, // 1 min for dev
      // }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3333);
}
bootstrap();
