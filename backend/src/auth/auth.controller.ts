import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  requestOtp(@Body('email') email: string) {
    return this.authService.requestOtp(email);
  }

  @Post('verify-otp')
  verifyOtp(@Body() body: { email: string; code: string }) {
    return this.authService.verifyOtp(body.email, body.code);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req) {
    return req.user;
  }
}
