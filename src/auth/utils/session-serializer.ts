import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UsersService } from '../../users/users.service';

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
    done: (err, user: { id: number; username: string }) => void,
  ) {
    console.log('SERIALIZE USER', user);
    return done(null, {
      id: user.id,
      username: user.username,
    });
  }

  async deserializeUser(
    user: { id: number; username: string },
    done: (err, user: User) => void,
  ) {
    console.log('DESERIALIZE USER: ', user);
    const userFromSession = await this.usersService.findUserById(user.id);

    if (!userFromSession) {
      return done(null, null);
    }

    return done(null, userFromSession);
  }
}
