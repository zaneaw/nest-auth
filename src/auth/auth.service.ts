import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    const passwordsMatch = await argon2.verify(user?.password, password);

    if (!passwordsMatch) {
      return null;
    }

    delete user.password;

    return user;
  }

  async signup(data: { email: string; username: string; password: string }) {
    const hashedPassword = await argon2.hash(data.password);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
      },
    });

    delete user.password;

    return user;
  }
}
