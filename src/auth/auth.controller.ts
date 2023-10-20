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
  async login(@Body() body) {
    return this.authService.login(body);
  }

  // create session cookie for user AFTER signup? How to do?
  // For now, just login after signup
  @Public()
  @Post('signup')
  async signup(@Body() body) {
    return this.authService.signup(body);
  }

  @Get('test')
  test() {
    return 'test';
  }
}
