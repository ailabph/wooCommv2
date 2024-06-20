import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('register')
  // async register(
  //   @Body('username') username: string,
  //   @Body('password') password: string,
  //   @Body('email') email: string,
  // ) {
  //   return this.authService.register(username, password, email);
  // }

  // @Post('signin')
  // async signIn(
  //   @Body('username') username: string,
  //   @Body('password') password: string,
  // ) {
  //   return this.authService.signIn(username, password);
  // }

  // @Post('refresh')
  // async refresh(
  //   @Body('refreshToken') refreshToken: string,
  //   @Body('username') username: string,
  // ) {
  //   return this.authService.refreshToken(refreshToken, username);
  // }
}
