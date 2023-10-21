import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';
import { Public } from '../common/utils/public-routes';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login() {
    // return this.authService.login(body);
    return true;
  }

  // Redirect to login page after signup if successful
  @Public()
  @Post('signup')
  async signup(@Body() body) {
    return this.authService.signup(body);
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

  @Get('test')
  test() {
    return 'test';
  }
}
