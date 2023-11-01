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

  // don't hit the DB on every request, just return the user from the session
  // user controller /currentUser will run the first time a user hits the site
  // and update the user in the session for us.
  async deserializeUser(user: UserSession, done: (err, user: any) => void) {
    // const userFromSession: UserWithoutPassword =
    //   await this.usersService.getUserById(user.id, user.sessionVerifiedAt);
    // console.log('deserializeUser()', user);
    // if (!userFromSession) {
    //   return done(null, null);
    // }

    // update passport user cookie data - this 'touch'es the session and resets the expiration
    // user.name = userFromSession.name;
    // user.username = userFromSession.username;
    // user.sessionVerifiedAt = Date.now();

    return done(null, user);
  }
}
