import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { UsersModule } from '../users/users.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports:     [TypeOrmModule.forFeature([Payment]), UsersModule, SubscriptionModule],
  providers:   [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
