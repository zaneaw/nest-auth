import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/utils/public-routes';
import { AuthService } from '../auth.service';

/**
 * This guard is used to protect the /auth/login route.
 * It uses the LocalStrategy defined in src/auth/strategies/local.strategy.ts
 * to validate the user's credentials.
 * If the credentials are valid, the user is logged in and the request is
 * allowed to proceed.
 * If the credentials are invalid, the request is rejected with
 * a 401, UnauthorizedRequest response.
 *
 * Creates the session cookie if successful.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private authService: AuthService) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    // console.log('LocalAuthGuard.canActivate()');
    const handlerName = context.getHandler().name;
    const cookie = context.switchToHttp().getRequest().headers.cookie;
    console.log('LocalAuthGuard.canActivate() cookie', cookie);

    // if it's the signup route, sign the user up first
    if (handlerName === 'signup') {
      // if the user is already logged in, throw an error
      // this works but if a user logs out and then back in, they will get this error
      if (cookie && cookie.includes('bday.sid')) {
        throw new BadRequestException('Already logged in');
      }

      const body = context.switchToHttp().getRequest().body;
      await this.authService.signup(body);
    }

    const result = (await super.canActivate(context)) as boolean;
    // console.log('LocalAuthGuard.canActivate() result', result);

    const request = context.switchToHttp().getRequest();
    // console.log('LocalAuthGuard Request', request);

    await super.logIn(request);
    // console.log('LocalAuthGuard Request after logIn', request);

    return result;
  }
}

/**
 * This guard is used globally to protect ALL routes except those
 * decorated with the @Public() decorator.
 * It uses the SessionSerializer defined in src/auth/utils/session-serializer.ts
 * to serialize and deserialize the user object into and out of the session.
 * If the user is authenticated, the request is allowed to proceed.
 * If the user is not authenticated, the request is rejected with
 * a 401, UnauthorizedRequest response.
 */
@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log('SessionGuard.canActivate()');
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // console.log('SessionGuard is Public');
      return true;
    }

    const request = context.switchToHttp().getRequest();

    return request.isAuthenticated();
  }
}
