import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { PLAN_MAP } from '../common/constants/plans.constant';
import { UsersService } from '../users/users.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { NOTIFY } from '../notifications/events/notification.events';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    private readonly cfg: ConfigService,
    private readonly usersService: UsersService,
    private readonly subscriptionService: SubscriptionService,
    private readonly events: EventEmitter2,
  ) {}

  async processPayment(userId: string, dto: ProcessPaymentDto) {
    const plan = PLAN_MAP.get(dto.planId);
    if (!plan) throw new BadRequestException(`Unknown plan: "${dto.planId}".`);

    const billingCycle = dto.billingCycle ?? 'monthly';
    const amountCents  = billingCycle === 'yearly' ? plan.yearlyPrice * 100 : plan.price * 100;

    const supported = ['card', 'google_pay', 'apple_pay'];
    if (!supported.includes(dto.paymentMethod)) {
      throw new BadRequestException(`Payment method "${dto.paymentMethod}" is not supported.`);
    }

    // Fetch user upfront so we can store their name in the payment record
    const user = await this.usersService.findById(userId);

    let chargeId = '';

    if (dto.paymentMethod === 'card') {
      chargeId = await this.chargeCard(amountCents, dto);
    } else if (dto.paymentMethod === 'google_pay' || dto.paymentMethod === 'apple_pay') {
      chargeId = await this.chargeWallet(amountCents, dto);
    }

    // Persist payment record
    await this.paymentRepo.save(
      this.paymentRepo.create({
        userId,
        userName:      user.name,
        planId:        dto.planId,
        paymentMethod: dto.paymentMethod,
        amountCents,
        chargeId,
        status:        PaymentStatus.SUCCEEDED,
      }),
    );

    // Activate the plan on the user profile
    await this.usersService.updatePlan(userId, dto.planId);

    // Create / replace subscription record
    await this.subscriptionService.create(userId, dto.planId, billingCycle, amountCents);

    // Fire-and-forget notification event
    this.events.emit(NOTIFY.PAYMENT_SUCCEEDED, {
      userId,
      recipientEmail: user.email,
      type:           NotificationType.PAYMENT_SUCCEEDED,
      title:          `Payment confirmed — ${plan.name} plan`,
      body:           `Your ${plan.name} plan is now active. $${(amountCents / 100).toFixed(2)} was charged via ${dto.paymentMethod.replace('_', ' ')}. Charge ID: ${chargeId}.`,
      metadata:       { planId: dto.planId, chargeId, amountCents, paymentMethod: dto.paymentMethod },
    });

    this.events.emit(NOTIFY.PLAN_ACTIVATED, {
      userId,
      recipientEmail: user.email,
      type:           NotificationType.PLAN_ACTIVATED,
      title:          `${plan.name} plan activated`,
      body:           `Welcome to your ${plan.name} plan. You now have access to ${plan.errands} errands/month.`,
      metadata:       { planId: dto.planId },
    });

    this.logger.log(`[${user.email}] payment succeeded — ${plan.name}/${billingCycle} $${(amountCents / 100).toFixed(2)} via ${dto.paymentMethod} (chargeId=${chargeId})`);

    return {
      success:       true,
      planId:        dto.planId,
      planName:      plan.name,
      amountCharged: plan.price,
      currency:      'usd',
      chargeId,
    };
  }

  private async chargeCard(amountCents: number, dto: ProcessPaymentDto): Promise<string> {
    const stripeKey = this.cfg.get<string>('STRIPE_SECRET_KEY');
    if (stripeKey) {
      // TODO: uncomment once stripe package is installed
      // const stripe = new (require('stripe'))(stripeKey);
      // const pm = await stripe.paymentMethods.create({ type: 'card', card: { number: dto.cardNumber, ... } });
      // const intent = await stripe.paymentIntents.create({ amount: amountCents, currency: 'usd', payment_method: pm.id, confirm: true });
      // return intent.id;
    }
    this.logger.warn(`[STUB] Card charge $${(amountCents / 100).toFixed(2)} — configure STRIPE_SECRET_KEY for live processing.`);
    return `ch_stub_card_${Date.now()}`;
  }

  private async chargeWallet(amountCents: number, dto: ProcessPaymentDto): Promise<string> {
    const stripeKey = this.cfg.get<string>('STRIPE_SECRET_KEY');
    if (stripeKey) {
      // TODO: uncomment once stripe package is installed
      // const stripe = new (require('stripe'))(stripeKey);
      // const intent = await stripe.paymentIntents.create({ amount: amountCents, currency: 'usd', payment_method: dto.paymentToken, confirm: true });
      // return intent.id;
    }
    this.logger.warn(`[STUB] ${dto.paymentMethod} charge $${amountCents / 100} — configure STRIPE_SECRET_KEY for live processing.`);
    return `ch_stub_wallet_${Date.now()}`;
  }
}
