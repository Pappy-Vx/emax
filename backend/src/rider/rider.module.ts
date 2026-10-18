import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiderService } from './rider.service';
import { RiderController } from './rider.controller';
import { Errand } from '../errands/entities/errand.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports:     [TypeOrmModule.forFeature([Errand, User])],
  providers:   [RiderService],
  controllers: [RiderController],
})
export class RiderModule {}
