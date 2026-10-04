import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports:     [TypeOrmModule.forFeature([Wallet]), UsersModule],
  providers:   [WalletService],
  controllers: [WalletController],
  exports:     [WalletService],
})
export class WalletModule {}
