import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findUserById(id: number): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  // Implement forgot password route

  // Implement reset password route

  // Implement change password route

  // Implement change email route

  // Implement change username route

  // Implement delete account route

  // Implement verify email route

  // Implement resend verification email route
}
