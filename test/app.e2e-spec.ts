import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { setup } from '../src/setup';
import * as colors from 'colors';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = setup(moduleRef.createNestApplication());

    // start server
    await app.init();
    await app.listen(3334);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3334');
  });

  afterAll(() => {
    app.close();
  });

  describe('==== User ====', () => {
    const testUser = {
      email: 'test@gmail.com',
      username: 'test',
      password: 'password',
    };

    const testUser2 = {
      email: 'another@gmail.com',
      username: 'another',
      password: 'password',
    };

    describe('Auth', () => {
      it('signup should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: '',
            username: testUser.username,
            password: testUser.password,
          })
          .expectStatus(400);
      });

      it('signup should throw if username empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: testUser.email,
            username: '',
            password: testUser.password,
          })
          .expectStatus(400);
      });

      it('signup should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: testUser.email,
            username: testUser.username,
            password: '',
          })
          .expectStatus(400);
      });

      it('signup should throw if email not valid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: 'notanemail',
            username: testUser.username,
            password: testUser.password,
          })
          .expectStatus(400);
      });

      // it.todo("should throw if username's not long enough");
      // it.todo('should throw if username contains invalid characters');
      // it.todo("should throw if password's not long enough");
      // it.todo("should throw if email isn't an email");
      // it.todo('should throw if email duplicate');
      // it.todo('should throw if username duplicate');
      // it.todo('should throw if password not valid');
      // it.todo('login: should throw if password not valid');

      it('signup should create user & session cookie', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: testUser.email,
            username: testUser.username,
            password: testUser.password,
          })
          .expectStatus(201)
          .stores((req, res) => {
            console.log(
              colors.bgYellow(
                `res.headers.cookies: ${JSON.stringify(res.headers, null, 4)}`,
              ),
            );
            const sessionId = res.headers['set-cookie'][0];
            console.log(colors.cyan(`scu&sc.COOKIE: ${sessionId}`));
            return { sessionId };
          });
      });

      // it('should create user & session cookie', async () => {
      //   const cookie = await pactum
      //     .spec()
      //     .post('/auth/signup')
      //     .withBody({
      //       email: testUser.email,
      //       username: testUser.username,
      //       password: testUser.password,
      //     })
      //     .returns((ctx) => {
      //       return ctx.res.headers['set-cookie'][0];
      //     });

      //   console.log(colors.cyan(`COOKIE: ${cookie}`));
      // });

      it('signout should signout user', () => {
        return pactum
          .spec()
          .post('/auth/signout')
          .withCookies('$S{sessionId}')
          .expectStatus(200);
      });

      it('signup should throw if user already exists', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: testUser.email,
            username: testUser.username,
            password: testUser.password,
          })
          .expectStatus(400);
      });

      // must use the 'username' field to login
      it('login should login user with email', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            username: testUser.email,
            password: testUser.password,
          })
          .expectStatus(200)
          .stores((req, res) => {
            const sessionId = res.headers['set-cookie'][0];
            console.log(colors.cyan(`sluwe.COOKIE: ${sessionId}`));
            return { sessionId };
          });
      });
      it('signout should signout user', () => {
        return pactum
          .spec()
          .post('/auth/signout')
          .withCookies('$S{sessionId}')
          .expectStatus(200);
      });

      it('login should login user with username', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            username: testUser.username,
            password: testUser.password,
          })
          .expectStatus(200)
          .stores((req, res) => {
            const sessionId = res.headers['set-cookie'][0];
            console.log(colors.cyan(`sluwu.COOKIE: ${sessionId}`));
            return { sessionId };
          });
      });

      it('signup should throw if logged in user tries to signup again', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: testUser2.email,
            username: testUser2.username,
            password: testUser2.password,
          })
          .withCookies('$S{sessionId}')
          .expectStatus(400);
      });

      it('login should throw if logged in user tries to login again', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: testUser.email,
            username: testUser.username,
            password: testUser.password,
          })
          .withCookies('$S{sessionId}')
          .expectStatus(400);
      });
    });
  });
});
