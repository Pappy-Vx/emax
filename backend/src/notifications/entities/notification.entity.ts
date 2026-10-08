import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

// ── Enums ────────────────────────────────────────────────────────

export enum NotificationType {
  // Auth
  WELCOME          = 'welcome',
  LOGIN_SUCCESS    = 'login_success',
  OTP_SENT         = 'otp_sent',
  // Payment
  PAYMENT_SUCCEEDED = 'payment_succeeded',
  PAYMENT_FAILED    = 'payment_failed',
  PAYMENT_REFUNDED  = 'payment_refunded',
  // Plan / Subscription
  PLAN_ACTIVATED          = 'plan_activated',
  PLAN_CHANGED            = 'plan_changed',
  SUBSCRIPTION_RENEWED    = 'subscription_renewed',
  SUBSCRIPTION_CANCELLED  = 'subscription_cancelled',
  SUBSCRIPTION_EXPIRING_SOON     = 'subscription_expiring_soon',
  SUBSCRIPTION_RENEWAL_REMINDER  = 'subscription_renewal_reminder',
  // Errands
  ERRAND_CREATED   = 'errand_created',
  ERRAND_CONFIRMED = 'errand_confirmed',
  ERRAND_PICKED_UP = 'errand_picked_up',
  ERRAND_COMPLETED = 'errand_completed',
  ERRAND_CANCELLED = 'errand_cancelled',
  // General
  SYSTEM           = 'system',
}

export enum NotificationChannel {
  EMAIL = 'email',
  PUSH  = 'push',
  SMS   = 'sms',
}

export enum NotificationStatus {
  PENDING = 'pending',  // queued, not yet attempted
  SENT    = 'sent',     // delivered successfully
  FAILED  = 'failed',   // delivery attempted but errored
}

// ── Entity ───────────────────────────────────────────────────────

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Email snapshot — survives user email changes
  @Column({ type: 'varchar' })
  recipientEmail: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'enum', enum: NotificationChannel, default: NotificationChannel.EMAIL })
  channel: NotificationChannel;

  @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.PENDING })
  status: NotificationStatus;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  body: string;

  // JSON context — plan name, errand id, charge id, etc.
  @Column({ type: 'text', nullable: true })
  metadata: string | null;

  @Column({ type: 'datetime', nullable: true })
  sentAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  failureReason: string | null;

  // Set when the user dismisses / reads the notification in the UI
  @Column({ type: 'datetime', nullable: true })
  readAt: Date | null;
}
