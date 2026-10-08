import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrandsService } from './errands.service';
import { ErrandsController } from './errands.controller';
import { Errand } from './entities/errand.entity';
import { Subscription } from '../subscription/entities/subscription.entity';
import { Payment } from '../payment/entities/payment.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports:     [TypeOrmModule.forFeature([Errand, Subscription, Payment]), UsersModule],
  providers:   [ErrandsService],
  controllers: [ErrandsController],
  exports:     [ErrandsService],
})
export class ErrandsModule {}
