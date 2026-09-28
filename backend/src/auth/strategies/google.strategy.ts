import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(cfg: ConfigService) {
    super({
      clientID:     cfg.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: cfg.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL:  cfg.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const email: string = profile.emails?.[0]?.value;
    const name: string = profile.displayName || profile.name?.givenName || 'User';
    done(null, { googleId: profile.id, email, name });
  }
}
