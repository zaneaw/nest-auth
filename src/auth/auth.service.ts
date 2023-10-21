import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as passport from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log('Validate User');
    const user = await this.usersService.findOne(username);

    // console.log('validateUser user: ', user);

    const passwordsMatch = await argon2.verify(user?.password, password);

    if (!passwordsMatch) {
      return null;
    }

    delete user.password;

    return user;
  }

  async signup(data: {
    email: string;
    username: string;
    password: string;
  }): Promise<User> {
    const hashedPassword = await argon2.hash(data.password);

    const user = await this.prisma.user
      .create({
        data: {
          email: data.email,
          username: data.username,
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

  async login(data: {
    password: string;
    email?: string;
    username?: string;
  }): Promise<User | void> {
    let user: User;

    console.log('Login');
    // console.log('data: ', data);

    if (!data.email && !data.username) {
      throw new BadRequestException('Email or username is required');
    }

    if (data.email) {
      user = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });
    } else {
      user = await this.prisma.user.findUnique({
        where: {
          username: data.username,
        },
      });
    }

    if (!user) {
      throw new BadRequestException(
        'Username, Email, or Password is incorrect',
      );
    }

    // console.log(user);

    const passwordsMatch = await argon2.verify(user?.password, data.password);

    if (!passwordsMatch) {
      throw new BadRequestException(
        'Username, Email, or Password is incorrect',
      );
    }

    // passport.authenticate('local', (err, user, info) => {});

    delete user.password;

    return user;
  }
}
