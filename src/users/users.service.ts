import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * @param usernameOrEmail - username or email
   * @returns
   */
  async findUser(usernameOrEmail: string): Promise<User | undefined> {
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

    return user;
  }

  async findUserById(id: number): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new BadRequestException('Error finding user');
    }

    return user;
  }

  // Implement reset password route
  async resetPassword(): Promise<void> {
    return;
  }

  // Implement forgot password route

  // Implement change password route

  // Implement change email route

  // Implement change username route

  // Implement delete account route

  // Implement verify email route

  // Implement resend verification email route
}
