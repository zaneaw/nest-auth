import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon2 from 'argon2';
import { UserSession, UserWithoutPassword, UsersForList } from '../../types';
import { validate } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<UserWithoutPassword> {
    const valUser = new CreateUserDto();
    valUser.email = data.email;
    valUser.username = data.username;
    valUser.password = data.password;

    await validate(valUser).then((errors) => {
      if (errors.length > 0) {
        throw new BadRequestException('Email, username, and password required');
      } else {
        console.log('No errors');
      }
    });

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

  async updateUser(
    username: string,
    data: UpdateUserDto,
    session: UserSession,
  ): Promise<UserWithoutPassword> {
    const updatedPassword = data.password ? true : false;

    // hash the new password before saving to DB
    if (updatedPassword) {
      data.password = await argon2.hash(data.password);
      data.passwordUpdatedAt = new Date();
    }

    const user = await this.prisma.user
      .update({
        where: {
          username,
        },
        data,
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

    // update session info, ID should not change
    session.username = user.username;
    session.name = user.name;

    if (updatedPassword) {
      session.sessionVerifiedAt = Date.now();
    }

    delete user.password;

    return user;
  }

  async validateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<UserWithoutPassword | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        ...(usernameOrEmail.includes('@')
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail }),
      },
    });

    if (!user) {
      throw new BadRequestException('Error finding user');
    }

    const passwordsMatch = await argon2.verify(user.password, password);

    if (!passwordsMatch) {
      return null;
    }

    delete user.password;

    return user;
  }

  async currentUser(userSession: UserSession): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userSession.id,
      },
    });

    if (!user) {
      throw new BadRequestException('Error finding user');
    }

    if (userSession.sessionVerifiedAt < user.passwordUpdatedAt.getTime()) {
      // console.info('Session has expired. Try logging in again.');
      throw new BadRequestException(
        'Session has expired. Try logging in again.',
      );
    }

    userSession.username = user.username;
    userSession.name = user.name;
    userSession.sessionVerifiedAt = Date.now();

    delete user.password;

    return user;
  }

  async getUserByUsername(username: string): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new BadRequestException('Error finding user');
    }

    delete user.password;

    return user;
  }

  async getUsers(): Promise<UsersForList[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
      },
    });

    return users;
  }

  // Implement reset password route

  // Implement forgot password route

  // Implement change password route

  // Implement change email route

  // Implement change username route

  // Implement delete account route

  // Implement verify email route

  // Implement resend verification email route
}
