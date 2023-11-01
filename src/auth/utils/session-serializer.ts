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
  serializeUser(
    user: User | UserWithoutPassword,
    done: (err, user: UserSession) => void,
  ) {
    // console.log('serializeUser: user', user);
    return done(null, {
      id: user.id,
      name: user.name,
      username: user.username,
      sessionVerifiedAt: Date.now(),
    });
  }

  async deserializeUser(user: UserSession, done: (err, user: any) => void) {
    const userFromSession: UserWithoutPassword =
      await this.usersService.getUserById(user.id, user.sessionVerifiedAt);
    // console.log('deserializeUser()', user, '\n', userFromSession);
    if (!userFromSession) {
      return done(null, null);
    }

    user.name = userFromSession.name;
    user.username = userFromSession.username;
    user.sessionVerifiedAt = Date.now();

    return done(null, user);
  }
}
