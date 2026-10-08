import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutSession } from './entities/checkout-session.entity';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports:     [TypeOrmModule.forFeature([CheckoutSession]), SubscriptionModule],
  providers:   [CheckoutService],
  controllers: [CheckoutController],
  exports:     [CheckoutService],
})
export class CheckoutModule {}
