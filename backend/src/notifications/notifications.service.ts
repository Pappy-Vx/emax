import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import {
  Notification,
  NotificationChannel,
  NotificationStatus,
} from './entities/notification.entity';
import { NotificationPayload, NOTIFY } from './events/notification.events';
import { MailService } from '../services/mail/mail.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
    private readonly mailService: MailService,
  ) {}

  // ── Query ──────────────────────────────────────────────────────

  /** Returns a user's notifications from the last `days` days, newest first. */
  async findForUser(userId: string, days = 30): Promise<Notification[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return this.repo.find({
      where:  { userId, createdAt: MoreThan(since) },
      order:  { createdAt: 'DESC' },
      select: ['id', 'type', 'channel', 'status', 'title', 'body', 'metadata',
               'sentAt', 'readAt', 'createdAt'],
    });
  }

  async markRead(id: string, userId: string): Promise<Notification> {
    const notif = await this.repo.findOneBy({ id });
    if (!notif)              throw new NotFoundException('Notification not found.');
    if (notif.userId !== userId) throw new ForbiddenException();
    if (!notif.readAt) {
      notif.readAt = new Date();
      await this.repo.save(notif);
    }
    return notif;
  }

  // ── Core send ─────────────────────────────────────────────────

  async send(payload: NotificationPayload): Promise<Notification> {
    const channel = payload.channel ?? NotificationChannel.EMAIL;

    // Persist as PENDING first
    const record = await this.repo.save(
      this.repo.create({
        userId:         payload.userId,
        recipientEmail: payload.recipientEmail,
        type:           payload.type,
        channel,
        status:         NotificationStatus.PENDING,
        title:          payload.title,
        body:           payload.body,
        metadata:       payload.metadata ? JSON.stringify(payload.metadata) : null,
        sentAt:         null,
        failureReason:  null,
        readAt:         null,
      }),
    );

    // Attempt delivery
    try {
      if (channel === NotificationChannel.EMAIL) {
        await this.mailService.send({
          to:      payload.recipientEmail,
          subject: payload.title,
          html:    `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0d2137;">${payload.body}</div>`,
        });
      }
      // PUSH: swap this block for FCM / APNS when ready
      // SMS:  swap this block for Twilio / AWS SNS when ready

      record.status = NotificationStatus.SENT;
      record.sentAt = new Date();
      this.logger.log(`[${channel.toUpperCase()}] Sent "${payload.title}" → ${payload.recipientEmail}`);
    } catch (err) {
      record.status        = NotificationStatus.FAILED;
      record.failureReason = (err as Error).message;
      this.logger.warn(`[${channel.toUpperCase()}] Failed "${payload.title}" → ${payload.recipientEmail}: ${(err as Error).message}`);
    }

    return this.repo.save(record);
  }

  // ── Event listeners ───────────────────────────────────────────
  // Each @OnEvent maps to a NOTIFY constant.
  // To upgrade to Kafka/RabbitMQ: swap @OnEvent → @EventPattern
  // and register a @MessagePattern / @EventPattern consumer.

  @OnEvent(NOTIFY.WELCOME)
  handleWelcome(p: NotificationPayload) { return this.send(p); }

  @OnEvent(NOTIFY.LOGIN_SUCCESS)
  handleLoginSuccess(p: NotificationPayload) { return this.send(p); }

  @OnEvent(NOTIFY.OTP_SENT)
  handleOtpSent(p: NotificationPayload) { return this.send(p); }

  @OnEvent(NOTIFY.PAYMENT_SUCCEEDED)
  handlePaymentSucceeded(p: NotificationPayload) { return this.send(p); }

  @OnEvent(NOTIFY.PAYMENT_FAILED)
  handlePaymentFailed(p: NotificationPayload) { return this.send(p); }

  @OnEvent(NOTIFY.PAYMENT_REFUNDED)
  handlePaymentRefunded(p: NotificationPayload) { return this.send(p); }

  @OnEvent(NOTIFY.PLAN_ACTIVATED)
  handlePlanActivated(p: NotificationPayload) { return this.send(p); }

  @OnEvent(NOTIFY.PLAN_CHANGED)
  handlePlanChanged(p: NotificationPayload) { return this.send(p); }

  @OnEvent(NOTIFY.ERRAND_CREATED)
  handleErrandCreated(p: NotificationPayload) { return this.send(p); }

  @OnEvent(NOTIFY.ERRAND_CONFIRMED)
  handleErrandConfirmed(p: NotificationPayload) { return this.send(p); }

  @OnEvent(NOTIFY.ERRAND_PICKED_UP)
  handleErrandPickedUp(p: NotificationPayload) { return this.send(p); }

  @OnEvent(NOTIFY.ERRAND_COMPLETED)
  handleErrandCompleted(p: NotificationPayload) { return this.send(p); }

  @OnEvent(NOTIFY.ERRAND_CANCELLED)
  handleErrandCancelled(p: NotificationPayload) { return this.send(p); }

  @OnEvent(NOTIFY.SUBSCRIPTION_RENEWED)
  handleSubscriptionRenewed(p: NotificationPayload) { return this.send(p); }

  @OnEvent(NOTIFY.SUBSCRIPTION_CANCELLED)
  handleSubscriptionCancelled(p: NotificationPayload) { return this.send(p); }

  @OnEvent(NOTIFY.SUBSCRIPTION_EXPIRING_SOON)
  handleSubscriptionExpiringSoon(p: NotificationPayload) { return this.send(p); }
}
