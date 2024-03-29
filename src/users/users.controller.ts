import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Session,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import type {
  UserSession,
  UserWithoutPassword,
  UsersForList,
} from '../../types';

type UserSessionNoVerifiedAt = Omit<UserSession, 'sessionVerifiedAt'>;

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Returns the user from the session
   */
  @Get('currentUser')
  async currentUser(@Session() session: any): Promise<UserSessionNoVerifiedAt> {
    console.log('currentUser()', session);
    const user = await this.usersService.currentUser(session.passport.user);
    return { username: user.username, name: user.name, id: user.id };
  }

  @Get('all')
  async getUsers(): Promise<UsersForList[]> {
    return this.usersService.getUsers();
  }

  @Get(':username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<UserWithoutPassword> {
    return this.usersService.getUserByUsername(username);
  }

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserWithoutPassword> {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':username')
  async updateUser(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
    @Session() session: any,
  ): Promise<UserWithoutPassword> {
    return this.usersService.updateUser(
      username,
      updateUserDto,
      session.passport.user,
    );
  }
}
