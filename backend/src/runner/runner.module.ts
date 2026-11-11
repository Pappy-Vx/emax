import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RunnerService } from './runner.service';
import { RunnerController } from './runner.controller';
import { Errand } from '../errands/entities/errand.entity';
import { User } from '../users/entities/user.entity';
import { ErrandsModule } from '../errands/errands.module';

@Module({
  imports:     [TypeOrmModule.forFeature([Errand, User]), ErrandsModule],
  providers:   [RunnerService],
  controllers: [RunnerController],
})
export class RunnerModule {}
