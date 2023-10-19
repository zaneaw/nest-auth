import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UsersService) {
    super();
  }

  /**
   * add info to the session
   */
  serializeUser(
    user: User,
    done: (err, user: { id: number; username: string }) => void,
  ) {
    console.log('SERIALIZE USER');
    return done(null, {
      id: user.id,
      username: user.username,
    });
  }

  async deserializeUser(
    user: { id: number; username: string },
    done: (err, user: User) => void,
  ) {
    console.log('DESERIALIZE USER');
    const userFromSession = await this.userService.findUserById(user.id);

    if (!userFromSession) {
      return done(null, null);
    }

    return done(null, userFromSession);
  }
}
