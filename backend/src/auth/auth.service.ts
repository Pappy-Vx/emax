import {
  Injectable, UnauthorizedException, BadRequestException, Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OtpService } from '../services/otp/otp.service';
import { MailService } from '../services/mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.isGoogleAuth) return null;
    const valid = await this.usersService.validatePassword(user, password);
    return valid ? user : null;
  }

  private issueToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id:           user.id,
        name:         user.name,
        email:        user.email,
        role:         user.role,
        planId:       user.planId,
        twoFaEnabled: user.twoFaEnabled,
        isGoogleAuth: user.isGoogleAuth,
        referralCode: user.referralCode,
        hivePoints:   user.hivePoints,
      },
    };
  }

  async login(user: User) {
    if (user.twoFaEnabled) {
      await this.dispatchOtp(user);
      return {
        otpRequired: true,
        message: 'A verification code has been sent to your email.',
      };
    }
    return this.issueToken(user);
  }

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);
    const sent = await this.dispatchOtp(user);
    return {
      otpRequired: true,
      emailSent: sent,
      message: sent
        ? 'Account created. Please check your email for a 6-digit verification code.'
        : 'Account created but we could not send the verification email. Please use Resend code once mail is configured.',
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !user.otpHash || !user.otpExpiresAt) {
      throw new UnauthorizedException('Invalid or expired verification code.');
    }

    if (new Date() > user.otpExpiresAt) {
      throw new UnauthorizedException('Verification code has expired. Please request a new one.');
    }

    if (!this.otpService.verify(dto.otp, user.otpHash)) {
      throw new UnauthorizedException('Incorrect verification code.');
    }

    const wasUnverified = !user.isVerified;
    await this.usersService.clearOtpAndVerify(user.id);

    if (wasUnverified) {
      this.mailService.sendWelcome(user.email, user.name).catch(() => {});
    }

    const refreshed = await this.usersService.findById(user.id);
    return this.issueToken(refreshed);
  }

  async resendOtp(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('No account found with that email.');
    const sent = await this.dispatchOtp(user);
    return {
      sent,
      message: sent
        ? 'A new verification code has been sent to your email.'
        : 'Could not send email — please check mail configuration and try again.',
    };
  }

  async googleLogin(googleUser: { googleId: string; email: string; name: string }) {
    let user = await this.usersService.findByEmail(googleUser.email);
    if (!user) {
      user = await this.usersService.createFromGoogle(googleUser);
    } else if (!user.googleId) {
      await this.usersService.linkGoogle(user.id, googleUser.googleId);
      user = await this.usersService.findById(user.id);
    }
    return this.issueToken(user);
  }

  private async dispatchOtp(user: User): Promise<boolean> {
    const code = this.otpService.generate();
    await this.usersService.storeOtp(user.id, this.otpService.hash(code), this.otpService.expiresAt(10));
    try {
      await this.mailService.sendOtp(user.email, code);
      return true;
    } catch (err) {
      // OTP is stored — the user can still request a resend once mail is fixed.
      this.logger.error(`OTP email failed for ${user.email}: ${(err as Error).message}`);
      return false;
    }
  }
}
