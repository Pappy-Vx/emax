import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpsService } from './ops.service';
import { OpsController } from './ops.controller';
import { Errand } from '../errands/entities/errand.entity';
import { User } from '../users/entities/user.entity';
import { Subscription } from '../subscription/entities/subscription.entity';
import { Payment } from '../payment/entities/payment.entity';

@Module({
  imports:     [TypeOrmModule.forFeature([Errand, User, Subscription, Payment])],
  providers:   [OpsService],
  controllers: [OpsController],
})
export class OpsModule {}
