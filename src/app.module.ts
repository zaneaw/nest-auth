import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { SessionGuard } from './auth/guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [],
  // providers: [PrismaService],
  providers: [PrismaService, { provide: 'APP_GUARD', useClass: SessionGuard }],
})
export class AppModule {}
