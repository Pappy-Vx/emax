import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly mailService: MailService) {}

  async notifyErrandUpdate(to: string, errandType: string, status: string): Promise<void> {
    try {
      await this.mailService.sendErrandUpdate(to, errandType, status);
    } catch (err) {
      this.logger.warn(`Could not send errand update notification to ${to}: ${(err as Error).message}`);
    }
  }

  // Placeholder for future push notification integration (e.g. Firebase Cloud Messaging)
  async sendPush(_userId: string, _title: string, _body: string): Promise<void> {
    this.logger.log('[Push notifications not yet configured]');
  }
}
