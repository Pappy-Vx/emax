import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY  = 'yearly',
}

export enum SubscriptionStatus {
  ACTIVE    = 'active',
  CANCELLED = 'cancelled',
  EXPIRED   = 'expired',
  PAST_DUE  = 'past_due',
}

@Entity('subscriptions')
export class Subscription extends BaseEntity {
  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 20 })
  planId: string;

  @Column({ type: 'enum', enum: BillingCycle })
  billingCycle: BillingCycle;

  @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.ACTIVE })
  status: SubscriptionStatus;

  @Column({ type: 'datetime' })
  currentPeriodStart: Date;

  @Column({ type: 'datetime' })
  currentPeriodEnd: Date;

  /** Amount charged this period in US cents */
  @Column({ type: 'int' })
  amountCents: number;

  /** When true the subscription renews automatically 1 day before period end */
  @Column({ type: 'tinyint', default: true })
  autoRenew: boolean;

  /** When true, the next renewal will cancel instead of charge */
  @Column({ type: 'tinyint', default: false })
  cancelAtPeriodEnd: boolean;

  /** Plan the user was on before a switch (audit trail) */
  @Column({ type: 'varchar', length: 20, nullable: true })
  previousPlanId: string | null;

  @Column({ type: 'varchar', nullable: true })
  stripeSubscriptionId: string | null;
}
