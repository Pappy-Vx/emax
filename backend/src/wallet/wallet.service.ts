import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Wallet, WalletType } from './entities/wallet.entity';

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
  constructor(
    @InjectRepository(Wallet)
    private readonly repo: Repository<Wallet>,
  ) {}

  async findForUser(userId: string): Promise<Wallet[]> {
    return this.repo.find({ where: { userId }, order: { isDefault: 'DESC', createdAt: 'ASC' } });
  }

  async save(userId: string, dto: SaveWalletDto): Promise<Wallet> {
    const last4Condition = dto.last4 ? { last4: dto.last4 } : { last4: IsNull() };
    const existing = await this.repo.findOneBy({ userId, type: dto.type, ...last4Condition });
    if (existing) return existing;  // idempotent — don't double-save the same card

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
      isDefault: hasDefault === 0,  // first saved method becomes default
    });
    return this.repo.save(wallet);
  }

  async setDefault(id: string, userId: string): Promise<Wallet> {
    const wallet = await this.repo.findOneBy({ id, userId });
    if (!wallet) throw new NotFoundException('Payment method not found.');

    // Clear existing default then set new one
    await this.repo.update({ userId }, { isDefault: false });
    await this.repo.update(id, { isDefault: true });
    return this.repo.findOneByOrFail({ id });
  }

  async remove(id: string, userId: string): Promise<void> {
    const wallet = await this.repo.findOneBy({ id, userId });
    if (!wallet) throw new NotFoundException('Payment method not found.');
    await this.repo.remove(wallet);

    // If we removed the default, promote the next oldest
    if (wallet.isDefault) {
      const next = await this.repo.findOne({ where: { userId }, order: { createdAt: 'ASC' } });
      if (next) await this.repo.update(next.id, { isDefault: true });
    }
  }
}
