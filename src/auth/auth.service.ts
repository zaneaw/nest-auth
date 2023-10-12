import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SignInDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOne(signInDto.username);

    const passwordsMatch = await argon2.verify(
      user?.password,
      signInDto.password,
    );

    if (!passwordsMatch) {
      throw new UnauthorizedException();
    }

    delete user.password;

    return user;
  }

  async signUp(signUpDto: SignUpDto) {
    const hashedPassword = await argon2.hash(signUpDto.password);

    const user = await this.prisma.user
      .create({
        data: {
          email: signUpDto.email,
          username: signUpDto.username,
          password: hashedPassword,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new BadRequestException('User already exists');
          }
        }

        throw error;
      });

    if (!user) {
      throw new BadRequestException('Error creating user');
    }

    delete user.password;

    return user;
  }
}
