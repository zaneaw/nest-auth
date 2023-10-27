import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UsersService } from '../../users/users.service';
import { UserWithoutPassword } from 'types';

export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {
    super();
  }

  /**
   * add info to the session
   */
  serializeUser(
    user: User,
    done: (err, user: { id: string; username: string }) => void,
  ) {
    return done(null, {
      id: user.id,
      username: user.username,
    });
  }

  async deserializeUser(
    user: { id: string; username: string },
    done: (err, user: UserWithoutPassword) => void,
  ) {
    const userFromSession = await this.usersService.getUserById(user.id);

    if (!userFromSession) {
      return done(null, null);
    }

    return done(null, userFromSession);
  }
}
