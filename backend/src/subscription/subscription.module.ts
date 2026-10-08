import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Errand } from '../errands/entities/errand.entity';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionScheduler } from './subscription.scheduler';
import { UsersModule } from '../users/users.module';

@Module({
  imports:     [TypeOrmModule.forFeature([Subscription, Payment, Errand]), UsersModule],
  providers:   [SubscriptionService, SubscriptionScheduler],
  controllers: [SubscriptionController],
  exports:     [SubscriptionService],
})
export class SubscriptionModule {}
