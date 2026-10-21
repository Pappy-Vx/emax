import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RunnerService } from './runner.service';
import { RunnerController } from './runner.controller';
import { Errand } from '../errands/entities/errand.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports:     [TypeOrmModule.forFeature([Errand, User])],
  providers:   [RunnerService],
  controllers: [RunnerController],
})
export class RunnerModule {}
