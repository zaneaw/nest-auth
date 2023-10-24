import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import * as session from 'express-session';
import * as passport from 'passport';
// import { logger } from './common/middleware/logger.middleware';

export function setup(app: INestApplication): INestApplication {
  // app.use(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production', // secure if prod
        maxAge:
          process.env.NODE_ENV === 'production'
            ? 1000 * 60 * 60 * 24 * 30 // 30 days for prod
            : 1000 * 60 * 1, // 1 min for dev
      },
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod:
          process.env.NODE_ENV === 'production'
            ? 1000 * 60 * 15 // 15 min for prod
            : 1000 * 30, // 30 sec for dev
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  return app;
}
