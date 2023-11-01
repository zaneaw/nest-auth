import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards';
import { Public } from '../common/utils/public-routes';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Session() session: any) {
    return session.passport.user;
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signup')
  async signup(@Session() session: any) {
    return session.passport.user;
  }

  @Post('signout')
  @HttpCode(200)
  async signout(@Req() req) {
    // deletes user from session, preventing authentication. Does NOT automatically delete the cookie.
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        throw new BadRequestException('Error signing out:\n', err);
      }
      return true;
    });

    return true;
  }

  @Get('test')
  test() {
    // console.log('REQ: ', req.session);
    return { data: 'test' };
  }
}
