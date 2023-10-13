import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // start server
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    // await prisma.post.deleteMany();
    // await prisma.user.deleteMany();
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

    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: 's',
            username: testUser.username,
            password: testUser.password,
          })
          .expectStatus(400);
      });

      it('should throw if username empty', () => {
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

      it('should throw if password empty', () => {
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

      it('should create user', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: testUser.email,
            username: testUser.username,
            password: testUser.password,
          })
          .expectStatus(201)
          .expectJsonLike({
            email: testUser.email,
            username: testUser.username,
          });
      });

      it('should throw if user already exists', () => {
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

      it.todo('verify session cookie');
      it.todo('logout user');
      it.todo('login user');
    });
  });
});
