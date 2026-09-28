import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum PaymentStatus {
  PENDING    = 'pending',     // intent created, awaiting user action
  PROCESSING = 'processing',  // submitted to processor, awaiting confirmation
  SUCCEEDED  = 'succeeded',   // charge confirmed, plan activated
  FAILED     = 'failed',      // processor declined or error
  CANCELLED  = 'cancelled',   // user abandoned before completion
  REFUNDED   = 'refunded',    // charge reversed after success
}

@Entity('payments')
export class Payment extends BaseEntity {
  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Denormalized snapshot so receipts survive user edits
  @Column({ type: 'varchar' })
  userName: string;

  @Column({ type: 'varchar', length: 20 })
  planId: string; // individual | family | business

  @Column({ type: 'varchar', length: 20 })
  paymentMethod: string; // card | google_pay | apple_pay

  @Column({ type: 'int' })
  amountCents: number;

  @Column({ type: 'varchar' })
  chargeId: string; // Stripe charge / payment-intent ID

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;
}
