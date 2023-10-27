import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto';
import { UserWithoutPassword } from 'types';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  /**
   * @param usernameOrEmail
   * @param password
   * @returns
   * @calls validate() in user.service.ts
   */
  async validateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    return this.usersService.validateUser(usernameOrEmail, password);
  }

  async signup(data: CreateUserDto): Promise<UserWithoutPassword> {
    return this.usersService.createUser(data);
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
