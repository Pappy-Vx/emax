import {
  Injectable, ConflictException, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.repo.findOneBy({ email: dto.email });
    if (existing) throw new ConflictException('Account already exists.');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const referralCode = this.generateReferralCode(dto.name);

    const user = this.repo.create({
      name:         dto.name,
      email:        dto.email,
      passwordHash,
      phone:        dto.phone,
      referralCode,
      referredBy:   dto.referredBy,
      hivePoints:   0,
      isVerified:   false,
      twoFaEnabled: false,
      isGoogleAuth: false,
    });
    return this.repo.save(user);
  }

  async createFromGoogle(data: { googleId: string; email: string; name: string }): Promise<User> {
    const referralCode = this.generateReferralCode(data.name);
    const user = this.repo.create({
      name:         data.name,
      email:        data.email,
      googleId:     data.googleId,
      isGoogleAuth: true,
      isVerified:   true,
      referralCode,
      hivePoints:   0,
    });
    return this.repo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .addSelect('u.otpHash')
      .addSelect('u.otpExpiresAt')
      .where('u.email = :email', { email })
      .getOne();
  }

  async findById(id: string): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  async updatePlan(userId: string, planId: string | null): Promise<User> {
    await this.repo.update(userId, { planId });
    return this.findById(userId);
  }

  async addPoints(userId: string, points: number): Promise<User> {
    const user = await this.findById(userId);
    await this.repo.update(userId, { hivePoints: user.hivePoints + points });
    return this.findById(userId);
  }

  async update2fa(userId: string, enabled: boolean): Promise<User> {
    await this.repo.update(userId, { twoFaEnabled: enabled });
    return this.findById(userId);
  }

  async storeOtp(userId: string, otpHash: string, otpExpiresAt: Date): Promise<void> {
    await this.repo.update(userId, { otpHash, otpExpiresAt });
  }

  async clearOtpAndVerify(userId: string): Promise<void> {
    await this.repo.update(userId, { otpHash: null, otpExpiresAt: null, isVerified: true });
  }

  async linkGoogle(userId: string, googleId: string): Promise<void> {
    await this.repo.update(userId, { googleId, isGoogleAuth: true, isVerified: true });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.passwordHash) return false;
    return bcrypt.compare(password, user.passwordHash);
  }

  private generateReferralCode(name: string): string {
    const prefix = name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
    return `EMAX-${prefix}`;
  }
}
