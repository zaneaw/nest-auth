import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

/**
 * LocalStrategy is a Passport strategy that we're using to validate a user's username and password.
 * If the username and password are valid, the validate() method returns the user.
 * Passport will build a user object based on the value we return from validate(),
 * and attach it as a property on the Request object.
 * We can access the user object later in our route handlers with @Req() req and req.user.
 *
 * If the username and password are not valid, we throw an UnauthorizedException.
 * This will result in a 401 Unauthorized response being sent to the client.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * @param username - username or email
   * @param password
   * @returns
   * @calls validateUser() in auth.service.ts
   */
  async validate(username: string, password: string): Promise<any> {
    console.log('LocalStrategy.validate()', username, password);
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
