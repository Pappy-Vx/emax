import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionService } from './subscription.service';

@Injectable()
export class SubscriptionScheduler {
  private readonly logger = new Logger(SubscriptionScheduler.name);

  constructor(private readonly subscriptionService: SubscriptionService) {}

  /** Runs every day at 6 AM — processes renewals and expiry warnings */
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async handleAutoRenewals() {
    this.logger.log('Running subscription renewal check…');
    await this.subscriptionService.processRenewals();
    this.logger.log('Subscription renewal check complete.');
  }
}
