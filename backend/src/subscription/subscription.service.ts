import {
  Injectable, BadRequestException, ForbiddenException, NotFoundException, Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Subscription, BillingCycle, SubscriptionStatus } from './entities/subscription.entity';
import { SwitchPlanDto } from './dto/switch-plan.dto';
import { PLAN_MAP } from '../common/constants/plans.constant';
import { UsersService } from '../users/users.service';
import { NOTIFY } from '../notifications/events/notification.events';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subRepo: Repository<Subscription>,
    private readonly usersService: UsersService,
    private readonly events: EventEmitter2,
  ) {}

  // ── Create ──────────────────────────────────────────────────────

  async create(
    userId: string,
    planId: string,
    billingCycle: 'monthly' | 'yearly',
    amountCents: number,
  ): Promise<Subscription> {
    // Expire any existing active subscription
    await this.subRepo.update(
      { userId, status: SubscriptionStatus.ACTIVE },
      { status: SubscriptionStatus.EXPIRED },
    );

    const now   = new Date();
    const cycle = billingCycle === 'yearly' ? BillingCycle.YEARLY : BillingCycle.MONTHLY;

    const sub = this.subRepo.create({
      userId,
      planId,
      billingCycle: cycle,
      status:            SubscriptionStatus.ACTIVE,
      currentPeriodStart: now,
      currentPeriodEnd:   this.addPeriod(now, cycle),
      amountCents,
      autoRenew:          true,
      cancelAtPeriodEnd:  false,
    });

    const saved = await this.subRepo.save(sub);
    this.logger.log(`Subscription created: ${planId}/${billingCycle} for user ${userId}`);
    return saved;
  }

  // ── Find active ─────────────────────────────────────────────────

  async findActive(userId: string): Promise<Subscription | null> {
    return this.subRepo.findOne({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveOrThrow(userId: string): Promise<Subscription> {
    const sub = await this.findActive(userId);
    if (!sub) throw new NotFoundException('No active subscription found.');
    return sub;
  }

  // ── Preview switch (returns proration without committing) ───────

  async previewSwitch(userId: string, dto: SwitchPlanDto): Promise<{
    prorationCreditCents: number;
    chargedCents: number;
  }> {
    const current  = await this.findActiveOrThrow(userId);
    const newPlan  = PLAN_MAP.get(dto.planId);
    const currPlan = PLAN_MAP.get(current.planId);
    if (!newPlan || !currPlan) throw new BadRequestException('Invalid plan.');

    const newCycle       = dto.billingCycle === 'yearly' ? BillingCycle.YEARLY : BillingCycle.MONTHLY;
    const newAmountCents = dto.billingCycle === 'yearly' ? newPlan.yearlyPrice * 100 : newPlan.price * 100;

    const rankDown  = newPlan.rank < currPlan.rank;
    const cycleDown =
      newPlan.rank === currPlan.rank &&
      current.billingCycle === BillingCycle.YEARLY &&
      newCycle === BillingCycle.MONTHLY;

    if (rankDown || cycleDown) {
      throw new ForbiddenException(
        JSON.stringify({ code: 'DOWNGRADE_NOT_ALLOWED', message: 'Cannot switch to a lower plan.' }),
      );
    }

    if (current.planId === dto.planId && current.billingCycle === newCycle) {
      throw new BadRequestException('You are already on this plan.');
    }

    const prorationCreditCents = this.calculateProration(current);
    const chargedCents = Math.max(0, newAmountCents - prorationCreditCents);
    return { prorationCreditCents, chargedCents };
  }

  // ── Switch plan ─────────────────────────────────────────────────

  async switchPlan(userId: string, dto: SwitchPlanDto): Promise<{
    subscription: Subscription;
    prorationCreditCents: number;
    chargedCents: number;
  }> {
    const current = await this.findActiveOrThrow(userId);
    const user    = await this.usersService.findById(userId);

    const newPlan  = PLAN_MAP.get(dto.planId);
    const currPlan = PLAN_MAP.get(current.planId);
    if (!newPlan || !currPlan) throw new BadRequestException('Invalid plan.');

    const newCycle = dto.billingCycle === 'yearly' ? BillingCycle.YEARLY : BillingCycle.MONTHLY;
    const newAmountCents =
      dto.billingCycle === 'yearly' ? newPlan.yearlyPrice * 100 : newPlan.price * 100;

    // ── Downgrade guard ──────────────────────────────────────────
    const rankDown  = newPlan.rank < currPlan.rank;
    const cycleDown =
      newPlan.rank === currPlan.rank &&
      current.billingCycle === BillingCycle.YEARLY &&
      newCycle === BillingCycle.MONTHLY;

    if (rankDown || cycleDown) {
      throw new ForbiddenException(
        JSON.stringify({
          code:    'DOWNGRADE_NOT_ALLOWED',
          message: 'Switching to a lower plan is not allowed. Please contact support if you need a refund.',
        }),
      );
    }

    // Same plan, same cycle — nothing to do
    if (current.planId === dto.planId && current.billingCycle === newCycle) {
      throw new BadRequestException('You are already on this plan.');
    }

    // ── Proration ────────────────────────────────────────────────
    const prorationCreditCents = this.calculateProration(current);
    const chargedCents = Math.max(0, newAmountCents - prorationCreditCents);

    // Expire current subscription, create the new one
    await this.subRepo.update(current.id, {
      status:            SubscriptionStatus.EXPIRED,
      cancelAtPeriodEnd: false,
    });

    const now = new Date();
    const newSub = await this.subRepo.save(
      this.subRepo.create({
        userId,
        planId:             dto.planId,
        billingCycle:       newCycle,
        status:             SubscriptionStatus.ACTIVE,
        currentPeriodStart: now,
        currentPeriodEnd:   this.addPeriod(now, newCycle),
        amountCents:        chargedCents,
        autoRenew:          true,
        cancelAtPeriodEnd:  false,
        previousPlanId:     current.planId,
      }),
    );

    // Update user's planId
    await this.usersService.updatePlan(userId, dto.planId);

    this.events.emit(NOTIFY.PLAN_CHANGED, {
      userId,
      recipientEmail: user.email,
      type:           NotificationType.PLAN_CHANGED,
      title:          `Plan switched to ${newPlan.name} (${dto.billingCycle})`,
      body:           `You switched from ${currPlan.name} to ${newPlan.name}. A prorated credit of $${(prorationCreditCents / 100).toFixed(2)} was applied — you were charged $${(chargedCents / 100).toFixed(2)}.`,
      metadata:       { prevPlanId: current.planId, newPlanId: dto.planId, prorationCreditCents, chargedCents },
    });

    this.logger.log(`Plan switched: ${current.planId} → ${dto.planId}/${dto.billingCycle} for user ${userId}`);
    return { subscription: newSub, prorationCreditCents, chargedCents };
  }

  // ── Cancel at period end ────────────────────────────────────────

  async cancel(userId: string): Promise<Subscription> {
    const sub  = await this.findActiveOrThrow(userId);
    const user = await this.usersService.findById(userId);

    await this.subRepo.update(sub.id, { cancelAtPeriodEnd: true });

    this.events.emit(NOTIFY.SUBSCRIPTION_CANCELLED, {
      userId,
      recipientEmail: user.email,
      type:           NotificationType.SUBSCRIPTION_CANCELLED,
      title:          'Subscription cancelled',
      body:           `Your ${PLAN_MAP.get(sub.planId)?.name ?? sub.planId} plan will remain active until ${sub.currentPeriodEnd.toDateString()}.`,
      metadata:       { planId: sub.planId, endsAt: sub.currentPeriodEnd },
    });

    return this.subRepo.findOneByOrFail({ id: sub.id });
  }

  // ── Toggle auto-renew ────────────────────────────────────────────

  async toggleAutoRenew(userId: string, autoRenew: boolean): Promise<Subscription> {
    const sub = await this.findActiveOrThrow(userId);
    await this.subRepo.update(sub.id, { autoRenew });
    return this.subRepo.findOneByOrFail({ id: sub.id });
  }

  // ── Auto-renewal (called by scheduler) ─────────────────────────

  async processRenewals(): Promise<void> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const expiring = await this.subRepo.find({
      where: {
        status:           SubscriptionStatus.ACTIVE,
        currentPeriodEnd: LessThanOrEqual(tomorrow),
      },
      relations: ['user'],
    });

    for (const sub of expiring) {
      if (sub.cancelAtPeriodEnd || !sub.autoRenew) {
        await this.subRepo.update(sub.id, { status: SubscriptionStatus.CANCELLED });
        await this.usersService.updatePlan(sub.userId, null);
        this.events.emit(NOTIFY.SUBSCRIPTION_CANCELLED, {
          userId:         sub.userId,
          recipientEmail: sub.user.email,
          type:           NotificationType.SUBSCRIPTION_CANCELLED,
          title:          'Subscription ended',
          body:           `Your ${PLAN_MAP.get(sub.planId)?.name ?? sub.planId} plan has ended.`,
          metadata:       { planId: sub.planId },
        });
      } else {
        // Renew: roll the period forward
        const newStart = new Date(sub.currentPeriodEnd);
        const newEnd   = this.addPeriod(newStart, sub.billingCycle);
        await this.subRepo.update(sub.id, {
          currentPeriodStart: newStart,
          currentPeriodEnd:   newEnd,
        });
        // TODO: charge via Stripe once integrated
        this.events.emit(NOTIFY.SUBSCRIPTION_RENEWED, {
          userId:         sub.userId,
          recipientEmail: sub.user.email,
          type:           NotificationType.SUBSCRIPTION_RENEWED,
          title:          `Subscription renewed — ${PLAN_MAP.get(sub.planId)?.name ?? sub.planId}`,
          body:           `Your ${sub.billingCycle} plan has been renewed. Next billing date: ${newEnd.toDateString()}.`,
          metadata:       { planId: sub.planId, newEnd },
        });
        this.logger.log(`Renewed subscription ${sub.id} → next end ${newEnd.toISOString()}`);
      }
    }

    // Warn users whose subscription expires in 3 days (and won't auto-renew)
    const in3days = new Date();
    in3days.setDate(in3days.getDate() + 3);

    const expiringSoon = await this.subRepo.find({
      where: {
        status:           SubscriptionStatus.ACTIVE,
        autoRenew:        false,
        currentPeriodEnd: LessThanOrEqual(in3days),
      },
      relations: ['user'],
    });

    for (const sub of expiringSoon) {
      this.events.emit(NOTIFY.SUBSCRIPTION_EXPIRING_SOON, {
        userId:         sub.userId,
        recipientEmail: sub.user.email,
        type:           NotificationType.SUBSCRIPTION_EXPIRING_SOON,
        title:          'Your subscription expires soon',
        body:           `Your ${PLAN_MAP.get(sub.planId)?.name ?? sub.planId} plan expires on ${sub.currentPeriodEnd.toDateString()}. Enable auto-renew or re-subscribe to keep your errands active.`,
        metadata:       { planId: sub.planId, expiresAt: sub.currentPeriodEnd },
      });
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────

  private addPeriod(from: Date, cycle: BillingCycle): Date {
    const d = new Date(from);
    if (cycle === BillingCycle.YEARLY) {
      d.setFullYear(d.getFullYear() + 1);
    } else {
      d.setMonth(d.getMonth() + 1);
    }
    return d;
  }

  private calculateProration(sub: Subscription): number {
    const now     = new Date();
    const msLeft  = sub.currentPeriodEnd.getTime() - now.getTime();
    const daysLeft = Math.max(0, msLeft / (1000 * 60 * 60 * 24));
    const totalDays = sub.billingCycle === BillingCycle.YEARLY ? 365 : 30;
    const dailyRate = sub.amountCents / totalDays;
    return Math.round(daysLeft * dailyRate);
  }
}
