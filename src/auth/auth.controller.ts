import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards';
import { Public } from '../common/utils/public-routes';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin() {
    return true;
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signup')
  async signup() {
    return true;
  }

  @Post('signout')
  async signout(@Req() req) {
    req.session.destroy();
    return true;
  }

  @Get('test')
  test() {
    return 'test';
  }

  // Implement logout route
  // how to remove session from sessionStore?

  // Implement forgot password route

  // Implement reset password route

  // Implement change password route

  // Implement change email route

  // Implement change username route

  // Implement delete account route

  // Implement verify email route

  // Implement resend verification email route

  // Implement remove all sessions from user route
}
