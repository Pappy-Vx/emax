import {
  Controller, Post, Get, Body, UseGuards,
  Request, Redirect, HttpCode, HttpStatus, Res, Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly cfg: ConfigService,
  ) {}

  /**
   * POST /api/v1/auth/register
   * Creates a new account, sends OTP email, returns { otpRequired: true }.
   */
  @Post('register')
  register(@Body() dto: RegisterDto) {
    this.logger.log(`register attempt: ${dto.email}`);
    return this.authService.register(dto);
  }

  /**
   * POST /api/v1/auth/login
   * Validates credentials via LocalStrategy.
   * - No 2FA: returns JWT immediately.
   * - 2FA enabled: sends OTP email, returns { otpRequired: true }.
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req) {
    this.logger.log(`login attempt: ${req.user?.email}`);
    return this.authService.login(req.user);
  }

  /**
   * POST /api/v1/auth/verify-otp
   * Verifies the 6-digit OTP and issues a JWT.
   * Used for both first-time registration verification and 2FA login.
   */
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  verifyOtp(@Body() dto: VerifyOtpDto) {
    this.logger.log(`verify-otp: ${dto.email}`);
    return this.authService.verifyOtp(dto);
  }

  /**
   * POST /api/v1/auth/resend-otp
   * Regenerates and resends the OTP for the given email.
   */
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  resendOtp(@Body('email') email: string) {
    this.logger.log(`resend-otp: ${email}`);
    return this.authService.resendOtp(email);
  }

  /**
   * GET /api/v1/auth/google
   * Initiates Google OAuth flow. Redirects to Google's consent screen.
   */
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // Passport handles the redirect
  }

  /**
   * GET /api/v1/auth/google/callback
   * Google redirects here after the user grants consent.
   * Creates/finds the user, issues a JWT, then does a 302 redirect to the frontend.
   */
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Request() req, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user);
    const frontendUrl = this.cfg.get<string>('FRONTEND_URL', 'http://localhost:3000');
    return res.redirect(`${frontendUrl}/auth/google?token=${result.access_token}`);
  }
}
