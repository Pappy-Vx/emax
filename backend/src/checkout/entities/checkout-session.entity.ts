import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('checkout_sessions')
export class CheckoutSession extends BaseEntity {
  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar', length: 30 })
  type: string; // 'new_subscription' | 'plan_switch' | 'single_errand'

  @Column({ type: 'varchar', length: 30 })
  planId: string;

  @Column({ type: 'varchar', length: 10 })
  billingCycle: string;

  @Column({ type: 'int' })
  chargeCents: number;

  @Column({ type: 'int', default: 0 })
  creditCents: number;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @Column({ type: 'datetime', nullable: true })
  usedAt: Date | null;
}
