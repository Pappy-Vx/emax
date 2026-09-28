import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MailModule } from '../services/mail/mail.module';

@Module({
  imports:     [TypeOrmModule.forFeature([Notification]), MailModule],
  providers:   [NotificationsService],
  controllers: [NotificationsController],
  exports:     [NotificationsService],
})
export class NotificationsModule {}
