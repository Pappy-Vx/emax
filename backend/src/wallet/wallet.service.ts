import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Wallet, WalletType } from './entities/wallet.entity';
import { UsersService } from '../users/users.service';

export interface SaveWalletDto {
  type: WalletType;
  last4?: string;
  brand?: string;
  cardholderName?: string;
  expiryMonth?: number;
  expiryYear?: number;
  stripePaymentMethodId?: string;
}

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    @InjectRepository(Wallet)
    private readonly repo: Repository<Wallet>,
    private readonly usersService: UsersService,
  ) {}

  async findForUser(userId: string): Promise<Wallet[]> {
    return this.repo.find({ where: { userId }, order: { isDefault: 'DESC', createdAt: 'ASC' } });
  }

  async save(userId: string, dto: SaveWalletDto): Promise<Wallet> {
    const email = await this.emailOf(userId);
    const last4Condition = dto.last4 ? { last4: dto.last4 } : { last4: IsNull() };
    const existing = await this.repo.findOneBy({ userId, type: dto.type, ...last4Condition });
    if (existing) {
      this.logger.log(`[${email}] wallet save skipped — ${dto.type} ****${dto.last4 ?? 'N/A'} already exists`);
      return existing;
    }

    const hasDefault = await this.repo.countBy({ userId });
    const wallet = this.repo.create({
      userId,
      type: dto.type,
      last4: dto.last4 ?? null,
      brand: dto.brand ?? null,
      cardholderName: dto.cardholderName ?? null,
      expiryMonth: dto.expiryMonth ?? null,
      expiryYear: dto.expiryYear ?? null,
      stripePaymentMethodId: dto.stripePaymentMethodId ?? null,
      isDefault: hasDefault === 0,
    });
    const saved = await this.repo.save(wallet);
    this.logger.log(`[${email}] wallet saved — ${dto.type} ****${dto.last4 ?? 'N/A'} (id=${saved.id})`);
    return saved;
  }

  async setDefault(id: string, userId: string): Promise<Wallet> {
    const email  = await this.emailOf(userId);
    const wallet = await this.repo.findOneBy({ id, userId });
    if (!wallet) {
      this.logger.warn(`[${email}] setDefault failed — wallet ${id} not found`);
      throw new NotFoundException('Payment method not found.');
    }

    await this.repo.update({ userId }, { isDefault: false });
    await this.repo.update(id, { isDefault: true });
    this.logger.log(`[${email}] default payment method set — ${wallet.type} ****${wallet.last4 ?? 'N/A'}`);
    return this.repo.findOneByOrFail({ id });
  }

  async remove(id: string, userId: string): Promise<void> {
    const email  = await this.emailOf(userId);
    const wallet = await this.repo.findOneBy({ id, userId });
    if (!wallet) {
      this.logger.warn(`[${email}] remove failed — wallet ${id} not found`);
      throw new NotFoundException('Payment method not found.');
    }
    await this.repo.remove(wallet);
    this.logger.log(`[${email}] wallet removed — ${wallet.type} ****${wallet.last4 ?? 'N/A'}`);

    if (wallet.isDefault) {
      const next = await this.repo.findOne({ where: { userId }, order: { createdAt: 'ASC' } });
      if (next) {
        await this.repo.update(next.id, { isDefault: true });
        this.logger.log(`[${email}] new default promoted — ${next.type} ****${next.last4 ?? 'N/A'}`);
      }
    }
  }

  private async emailOf(userId: string): Promise<string> {
    try {
      const user = await this.usersService.findById(userId);
      return user.email;
    } catch {
      return `uid:${userId}`;
    }
  }
}
