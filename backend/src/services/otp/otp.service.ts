import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  generate(): string {
    return String(crypto.randomInt(100000, 999999));
  }

  hash(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  verify(otp: string, storedHash: string): boolean {
    return this.hash(otp) === storedHash;
  }

  expiresAt(minutes = 10): Date {
    return new Date(Date.now() + minutes * 60_000);
  }
}
