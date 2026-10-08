import {
  Injectable, BadRequestException, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckoutSession } from './entities/checkout-session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { PLAN_MAP } from '../common/constants/plans.constant';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(CheckoutSession)
    private readonly repo: Repository<CheckoutSession>,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async createSession(userId: string, dto: CreateSessionDto): Promise<CheckoutSession> {
    const plan = PLAN_MAP.get(dto.planId);
    if (!plan) throw new BadRequestException(`Unknown plan: "${dto.planId}".`);

    const billingCycle = dto.billingCycle ?? 'monthly';
    let chargeCents: number;
    let creditCents = 0;

    if (dto.type === 'single_errand') {
      chargeCents = Math.round(plan.price * 100);
    } else if (dto.type === 'new_subscription') {
      chargeCents = billingCycle === 'yearly'
        ? Math.round(plan.yearlyPrice * 100)
        : Math.round(plan.price * 100);
    } else if (dto.type === 'plan_switch') {
      // previewSwitch validates upgrade rules and calculates proration
      const preview = await this.subscriptionService.previewSwitch(userId, {
        planId: dto.planId,
        billingCycle,
      });
      chargeCents = preview.chargedCents;
      creditCents = preview.prorationCreditCents;
    } else {
      throw new BadRequestException('Invalid session type.');
    }

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    return this.repo.save(
      this.repo.create({
        userId,
        type:         dto.type,
        planId:       dto.planId,
        billingCycle,
        chargeCents,
        creditCents,
        expiresAt,
        usedAt: null,
      }),
    );
  }

  async getSession(id: string, userId: string): Promise<CheckoutSession> {
    const session = await this.repo.findOneBy({ id, isDeleted: false });
    if (!session)               throw new NotFoundException('Checkout session not found.');
    if (session.userId !== userId) throw new ForbiddenException();
    if (session.usedAt)         throw new BadRequestException('This checkout session has already been used.');
    if (session.expiresAt < new Date())
      throw new BadRequestException('This checkout session has expired. Please go back and try again.');
    return session;
  }

  async markUsed(id: string): Promise<void> {
    await this.repo.update(id, { usedAt: new Date() });
  }
}
