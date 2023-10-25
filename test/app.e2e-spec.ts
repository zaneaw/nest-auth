import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { setup } from '../src/setup';

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
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333');
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
      it('Should throw if email empty', () => {
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

      it('Should throw if username empty', () => {
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

      it('Should throw if password empty', () => {
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

      it('Should throw if email not valid', () => {
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
      
      it.todo('Should throw if email duplicate');
      it.todo('Should throw if username duplicate');
      it.todo('Should throw if password not valid');
      it.todo('Login: Should throw if password not valid');

      it('Should create user & session cookie', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: testUser.email,
            username: testUser.username,
            password: testUser.password,
          })
          .expectStatus(201)
          .stores('SessionCookie', "res.cookies['bday.sid']");
      });

      it('Should signout user', () => {
        return pactum
          .spec()
          .post('/auth/signout')
          .withCookies('bday.sid', '$S{SessionCookie}')
          .expectStatus(200);
      });

      it('Should throw if user already exists', () => {
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

      it('Should signin user', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: testUser.email,
            username: testUser.username,
            password: testUser.password,
          })
          .expectStatus(200)
          .stores('SessionCookie', "res.cookies['bday.sid']")
      });

      it('Should throw if logged in user tries to signup again', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: testUser2.email,
            username: testUser2.username,
            password: testUser2.password,
          })
          .withCookies('bday.sid', '$S{SessionCookie}')
          .expectStatus(400);
      });

      it('Should throw if logged in user tries to login again', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: testUser2.email,
            username: testUser2.username,
            password: testUser2.password,
          })
          .withCookies('bday.sid', '$S{SessionCookie}')
          .expectStatus(400);
      });
    });
  });
});
