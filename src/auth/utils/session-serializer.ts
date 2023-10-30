import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UsersService } from '../../users/users.service';
import type { UserSession, UserWithoutPassword } from 'types';

export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {
    super();
  }

  /**
   * add info to the session
   */
  serializeUser(user: User, done: (err, user: UserSession) => void) {
    return done(null, {
      id: user.id,
      username: user.username,
      sessionCreatedAt: Date.now(),
    });
  }

  async deserializeUser(
    user: UserSession,
    done: (err, user: UserWithoutPassword) => void,
  ) {
    const userFromSession = await this.usersService.getUserById(
      user.id,
      user.sessionCreatedAt,
    );

    if (!userFromSession) {
      return done(null, null);
    }

    return done(null, userFromSession);
  }
}
