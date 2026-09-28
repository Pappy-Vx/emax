import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum WalletType {
  CARD       = 'card',
  GOOGLE_PAY = 'google_pay',
  APPLE_PAY  = 'apple_pay',
}

@Entity('wallets')
export class Wallet extends BaseEntity {
  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: WalletType })
  type: WalletType;

  // Card-specific fields (null for Google Pay / Apple Pay)
  @Column({ type: 'varchar', length: 4, nullable: true })
  last4: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  brand: string | null;  // Visa, Mastercard, Amex, Discover

  @Column({ type: 'varchar', nullable: true })
  cardholderName: string | null;

  @Column({ type: 'int', nullable: true })
  expiryMonth: number | null;

  @Column({ type: 'int', nullable: true })
  expiryYear: number | null;

  // Stripe saved payment method id (for future charging without re-entry)
  @Column({ type: 'varchar', nullable: true })
  stripePaymentMethodId: string | null;

  @Column({ type: 'tinyint', default: false })
  isDefault: boolean;
}
