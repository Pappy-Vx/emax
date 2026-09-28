import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ErrandsModule } from './errands/errands.module';
import { AddressesModule } from './addresses/addresses.module';
import { PaymentModule } from './payment/payment.module';
import { FeatureFlagsModule } from './feature-flags/feature-flags.module';
import { MailModule } from './services/mail/mail.module';
import { NotificationModule } from './services/notification/notification.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WalletModule } from './wallet/wallet.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // In-process event bus — swap for Kafka/RabbitMQ by replacing this module
    // with ClientsModule from @nestjs/microservices and changing @OnEvent → @EventPattern
    EventEmitterModule.forRoot({ wildcard: false, maxListeners: 20 }),

    // Cron scheduler — used by SubscriptionScheduler for daily auto-renewals
    ScheduleModule.forRoot(),

    // MySQL — Namecheap shared hosting (or local for dev)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type:     'mysql',
        host:     cfg.get<string>('DB_HOST', 'localhost'),
        port:     cfg.get<number>('DB_PORT', 3306),
        database: cfg.get<string>('DB_NAME', 'emax'),
        username: cfg.get<string>('DB_USER', 'root'),
        password: cfg.get<string>('DB_PASSWORD', ''),
        charset:  'utf8mb4',
        autoLoadEntities: true,
        // synchronize: true only in development — use migrations in production
        synchronize: cfg.get<string>('NODE_ENV') !== 'production',
        timezone: 'Z',
      }),
    }),

    AuthModule,
    UsersModule,
    ErrandsModule,
    AddressesModule,
    PaymentModule,
    WalletModule,
    SubscriptionModule,
    FeatureFlagsModule,
    MailModule,
    NotificationModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers:   [AppService],
})
export class AppModule {}
