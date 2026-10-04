import {
  Injectable, ConflictException, NotFoundException, Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

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
    const saved = await this.repo.save(user);
    this.logger.log(`[${dto.email}] user created (id=${saved.id})`);
    return saved;
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
    const saved = await this.repo.save(user);
    this.logger.log(`[${data.email}] google user created (id=${saved.id})`);
    return saved;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .addSelect('u.otpHash')
      .addSelect('u.otpExpiresAt')
      .where('u.email = :email', { email })
      .getOne();
    this.logger.log(`[${email}] findByEmail → ${user ? `found (id=${user.id})` : 'not found'}`);
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  async updatePlan(userId: string, planId: string | null): Promise<User> {
    await this.repo.update(userId, { planId });
    const user = await this.findById(userId);
    this.logger.log(`[${user.email}] plan updated → ${planId ?? 'none'}`);
    return user;
  }

  async addPoints(userId: string, points: number): Promise<User> {
    const user = await this.findById(userId);
    await this.repo.update(userId, { hivePoints: user.hivePoints + points });
    this.logger.log(`[${user.email}] +${points} hive points (total=${user.hivePoints + points})`);
    return this.findById(userId);
  }

  async update2fa(userId: string, enabled: boolean): Promise<User> {
    await this.repo.update(userId, { twoFaEnabled: enabled });
    const user = await this.findById(userId);
    this.logger.log(`[${user.email}] 2FA set to ${enabled}`);
    return user;
  }

  async storeOtp(userId: string, otpHash: string, otpExpiresAt: Date): Promise<void> {
    await this.repo.update(userId, { otpHash, otpExpiresAt });
    const user = await this.findById(userId).catch(() => null);
    this.logger.log(`[${user?.email ?? userId}] OTP stored (expires ${otpExpiresAt.toISOString()})`);
  }

  async clearOtpAndVerify(userId: string): Promise<void> {
    await this.repo.update(userId, { otpHash: null, otpExpiresAt: null, isVerified: true });
    const user = await this.findById(userId).catch(() => null);
    this.logger.log(`[${user?.email ?? userId}] OTP cleared, account verified`);
  }

  async linkGoogle(userId: string, googleId: string): Promise<void> {
    await this.repo.update(userId, { googleId, isGoogleAuth: true, isVerified: true });
    const user = await this.findById(userId).catch(() => null);
    this.logger.log(`[${user?.email ?? userId}] Google account linked`);
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
