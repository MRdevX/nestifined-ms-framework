import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import type { AuthService } from './auth.service';
import { CurrentUser as CurrentUserDecorator } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import type { ForgotPasswordDto } from './dto/forgot-password.dto';
import type { LoginDto } from './dto/login.dto';
import type { RefreshTokenDto } from './dto/refresh-token.dto';
import type { RegisterDto } from './dto/register.dto';
import type { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import type { CurrentUser } from './interfaces/auth.interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Body() _loginDto: LoginDto, @Request() req) {
    return this.authService.loginWithUser(req.user);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@CurrentUserDecorator() user: CurrentUser) {
    await this.authService.logout(user.id);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
