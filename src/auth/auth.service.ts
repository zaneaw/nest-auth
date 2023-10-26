import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { type User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SignupDto } from './dto/index';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  /**
   * @param usernameOrEmail
   * @param password
   * @returns
   * @calls validate() in user.service.ts
   */
  async validateUser(usernameOrEmail: string, password: string): Promise<any> {
    const user = await this.usersService.findUser(usernameOrEmail);

    const passwordsMatch = await argon2.verify(user?.password, password);

    if (!passwordsMatch) {
      return null;
    }

    delete user.password;

    return user;
  }

  async signup(authDto: SignupDto): Promise<User> {
    if (!authDto.email || !authDto.username || !authDto.password) {
      throw new BadRequestException('Email, username, and password required');
    }

    const hashedPassword = await argon2.hash(authDto.password);

    const user = await this.prisma.user
      .create({
        data: {
          email: authDto.email,
          username: authDto.username,
          password: hashedPassword,
        },
      })
      .catch((err) => {
        if (err instanceof PrismaClientKnownRequestError) {
          // unique constraint failed
          if (err.code === 'P2002') {
            throw new BadRequestException('Username or Email is already taken');
          }
        }

        throw err;
      });

    delete user.password;

    return user;
  }

  // async login(authDto: AuthDto): Promise<User | void> {
  //   if (!authDto.email && !authDto.username) {
  //     throw new BadRequestException('Email or username is required');
  //   }

  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       ...(authDto.email
  //         ? { email: authDto.email }
  //         : { username: authDto.username }),
  //     },
  //   });

  //   if (!user) {
  //     throw new BadRequestException(
  //       'Username, Email, or Password is incorrect',
  //     );
  //   }

  //   const passwordsMatch = await argon2.verify(
  //     user?.password,
  //     authDto.password,
  //   );

  //   if (!passwordsMatch) {
  //     throw new BadRequestException(
  //       'Username, Email, or Password is incorrect',
  //     );
  //   }

  //   // passport.authenticate('local', (err, user, info) => {});

  //   delete user.password;

  //   return user;
  // }
}
