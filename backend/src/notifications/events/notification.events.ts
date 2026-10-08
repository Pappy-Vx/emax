import { NotificationChannel, NotificationType } from '../entities/notification.entity';

/**
 * Event name constants — emit these from any service.
 *
 * SWAP POINT FOR MESSAGE BROKER:
 *   Current:   @nestjs/event-emitter  (in-process, zero infra)
 *   Kafka:     replace EventEmitterModule with ClientsModule (transport: Transport.KAFKA)
 *              and swap @OnEvent → @EventPattern
 *   RabbitMQ:  replace with ClientsModule (transport: Transport.RMQ)
 *              or @golevelup/nestjs-rabbitmq for richer routing
 *
 * Nothing else in the codebase changes — only this module and its module definition.
 */
export const NOTIFY = {
  // Auth
  WELCOME:           'auth.welcome',
  LOGIN_SUCCESS:     'auth.login.success',
  OTP_SENT:          'auth.otp.sent',
  // Payment
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED:    'payment.failed',
  PAYMENT_REFUNDED:  'payment.refunded',
  // Plan / Subscription
  PLAN_ACTIVATED:                 'plan.activated',
  PLAN_CHANGED:                   'plan.changed',
  SUBSCRIPTION_RENEWED:           'subscription.renewed',
  SUBSCRIPTION_CANCELLED:         'subscription.cancelled',
  SUBSCRIPTION_EXPIRING_SOON:     'subscription.expiring_soon',
  SUBSCRIPTION_RENEWAL_REMINDER:  'subscription.renewal_reminder',
  // Errands
  ERRAND_CREATED:    'errand.created',
  ERRAND_CONFIRMED:  'errand.confirmed',
  ERRAND_PICKED_UP:  'errand.picked_up',
  ERRAND_COMPLETED:  'errand.completed',
  ERRAND_CANCELLED:  'errand.cancelled',
} as const;

export type NotifyEvent = (typeof NOTIFY)[keyof typeof NOTIFY];

export interface NotificationPayload {
  userId:         string;
  recipientEmail: string;
  type:           NotificationType;
  title:          string;
  body:           string;
  channel?:       NotificationChannel; // defaults to EMAIL
  metadata?:      Record<string, unknown>;
}
