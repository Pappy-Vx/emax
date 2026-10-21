import {
  Injectable, NotFoundException, ForbiddenException, Logger,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, IsNull } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Errand } from './entities/errand.entity';
import { Subscription, SubscriptionStatus, BillingCycle } from '../subscription/entities/subscription.entity';
import { Payment, PaymentStatus } from '../payment/entities/payment.entity';
import { CreateErrandDto } from './dto/create-errand.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { NOTIFY } from '../notifications/events/notification.events';
import { NotificationType } from '../notifications/entities/notification.entity';
import { PLAN_MAP } from '../common/constants/plans.constant';

const POINTS_PER_ERRAND = 20;

@Injectable()
export class ErrandsService {
  private readonly logger = new Logger(ErrandsService.name);

  constructor(
    @InjectRepository(Errand)
    private readonly repo: Repository<Errand>,
    @InjectRepository(Subscription)
    private readonly subRepo: Repository<Subscription>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly usersService: UsersService,
    private readonly events: EventEmitter2,
  ) {}

  async create(userId: string, dto: CreateErrandDto): Promise<Errand> {
    await this.assertCanCreateErrand(userId);

    const code = String(Math.floor(1000 + Math.random() * 9000));

    const errand = this.repo.create({
      userId,
      type:               dto.type,
      fromAddress:        dto.fromAddress,
      toAddress:          dto.toAddress,
      scheduledAt:        new Date(dto.scheduledAt),
      notes:              dto.notes,
      isRecurring:        dto.isRecurring ?? false,
      recurringFrequency: dto.recurringFrequency,
      status:             'scheduled',
      code,
    });
    const saved = await this.repo.save(errand);
    // Auto-assign to the least-loaded active runner (max 3 errands/day)
    await this.autoAssignRider(saved);
    const user = await this.usersService.findById(userId).catch(() => null);
    this.logger.log(`[${user?.email ?? userId}] errand created (id=${saved.id} type=${dto.type} scheduledAt=${dto.scheduledAt})`);
    if (user) {
      this.events.emit(NOTIFY.ERRAND_CREATED, {
        userId,
        recipientEmail: user.email,
        type:           NotificationType.ERRAND_CREATED,
        title:          'Errand requested',
        body:           `Your ${dto.type} errand has been received and is pending confirmation. Scheduled for ${new Date(dto.scheduledAt).toLocaleString()}.`,
        metadata:       { errandId: saved.id, errandType: dto.type },
      });
    }
    return saved;
  }

  async findForUser(userId: string): Promise<Errand[]> {
    return this.repo.find({
      where: { userId },
      order: { scheduledAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Errand> {
    const errand = await this.repo.findOneBy({ id });
    if (!errand) throw new NotFoundException('Errand not found.');
    if (errand.userId !== userId) throw new ForbiddenException();
    return errand;
  }

  async cancel(id: string, userId: string): Promise<Errand> {
    const errand = await this.findOne(id, userId);
    if (['completed', 'cancelled'].includes(errand.status)) {
      throw new ForbiddenException('Cannot cancel a completed or already cancelled errand.');
    }
    await this.repo.update(id, { status: 'cancelled' });
    const updated = await this.findOne(id, userId);
    const user = await this.usersService.findById(userId);
    this.logger.log(`[${user.email}] errand cancelled (id=${id} type=${errand.type})`);
    this.events.emit(NOTIFY.ERRAND_CANCELLED, {
      userId,
      recipientEmail: user.email,
      type:           NotificationType.ERRAND_CANCELLED,
      title:          'Errand cancelled',
      body:           `Your ${errand.type} errand scheduled for ${errand.scheduledAt.toLocaleString()} has been cancelled.`,
      metadata:       { errandId: id, errandType: errand.type },
    });
    return updated;
  }

  async complete(id: string): Promise<Errand> {
    const errand = await this.repo.findOneBy({ id });
    if (!errand) throw new NotFoundException('Errand not found.');
    await this.repo.update(id, { status: 'completed' });
    await this.usersService.addPoints(errand.userId, POINTS_PER_ERRAND);
    const updated = await this.repo.findOneBy({ id });
    const user = await this.usersService.findById(errand.userId);
    this.logger.log(`[${user.email}] errand completed (id=${id} type=${errand.type} +${POINTS_PER_ERRAND} pts)`);
    this.events.emit(NOTIFY.ERRAND_COMPLETED, {
      userId:         errand.userId,
      recipientEmail: user.email,
      type:           NotificationType.ERRAND_COMPLETED,
      title:          'Errand completed',
      body:           `Your ${errand.type} errand has been completed. You earned ${POINTS_PER_ERRAND} loyalty points!`,
      metadata:       { errandId: id, errandType: errand.type, pointsEarned: POINTS_PER_ERRAND },
    });
    return updated!;
  }

  async updateStatus(id: string, status: Errand['status']): Promise<Errand> {
    const errand = await this.repo.findOneBy({ id });
    if (!errand) throw new NotFoundException('Errand not found.');
    await this.repo.update(id, { status });
    const updated = await this.repo.findOneBy({ id });
    const user = await this.usersService.findById(errand.userId);
    this.logger.log(`[${user.email}] errand status → ${status} (id=${id} type=${errand.type})`);

    type StatusMeta = { event: string; type: NotificationType; title: string; body: string };
    // Keys must match ErrandStatus values exactly (as stored in DB)
    const STATUS_EVENTS: Partial<Record<string, StatusMeta>> = {
      confirmed: {
        event: NOTIFY.ERRAND_CONFIRMED,
        type:  NotificationType.ERRAND_CONFIRMED,
        title: 'Errand confirmed',
        body:  `Your ${errand.type} errand has been confirmed and an agent is on it.`,
      },
      'picked-up': {
        event: NOTIFY.ERRAND_PICKED_UP,
        type:  NotificationType.ERRAND_PICKED_UP,
        title: 'Errand picked up',
        body:  `Your ${errand.type} errand has been picked up and is heading to the delivery address.`,
      },
      'on-the-way': {
        event: NOTIFY.ERRAND_PICKED_UP,
        type:  NotificationType.ERRAND_PICKED_UP,
        title: 'Errand on the way',
        body:  `Your ${errand.type} errand is on the way to the delivery address.`,
      },
    };

    const ev = STATUS_EVENTS[status];
    if (ev) {
      this.events.emit(ev.event, {
        userId:         errand.userId,
        recipientEmail: user.email,
        type:           ev.type,
        title:          ev.title,
        body:           ev.body,
        metadata:       { errandId: id, errandType: errand.type, newStatus: status },
      });
    }
    return updated!;
  }

  // ── Business rule enforcement ──────────────────────────────────

  /**
   * Throws ForbiddenException if the user cannot create another errand.
   * Rules:
   *  1. Active subscription → check monthly errand usage against plan limit.
   *  2. No active subscription → check for an unused single_errand payment credit.
   *  3. Neither → reject.
   */
  private async assertCanCreateErrand(userId: string): Promise<void> {
    const now = new Date();

    const sub = await this.subRepo.findOne({
      where:  { userId, status: SubscriptionStatus.ACTIVE },
      order:  { createdAt: 'DESC' },
    });

    if (sub) {
      const plan = PLAN_MAP.get(sub.planId);
      if (!plan || plan.errands <= 0) return; // unlimited plan, allow

      // For yearly billing count only current calendar month so monthly quota isn't
      // exhausted permanently by a single busy month mid-year.
      const windowStart = sub.billingCycle === BillingCycle.YEARLY
        ? new Date(now.getFullYear(), now.getMonth(), 1)
        : sub.currentPeriodStart;

      const used = await this.repo
        .createQueryBuilder('e')
        .where('e.userId = :userId',        { userId })
        .andWhere('e.status != :cancelled', { cancelled: 'cancelled' })
        .andWhere('e.createdAt >= :start',  { start: windowStart })
        .andWhere('e.isDeleted = :del',     { del: false })
        .getCount();

      if (used >= plan.errands) {
        throw new ForbiddenException(
          JSON.stringify({
            code:    'ERRAND_LIMIT_REACHED',
            message: `Monthly errand limit reached (${plan.errands}/${plan.errands}). Purchase a single errand or upgrade your plan.`,
          }),
        );
      }
      return;
    }

    // No active subscription — look for an unused single_errand credit.
    const singlePayment = await this.paymentRepo.findOne({
      where: { userId, planId: 'single_errand', status: PaymentStatus.SUCCEEDED },
      order: { createdAt: 'DESC' },
    });

    if (!singlePayment) {
      throw new ForbiddenException(
        JSON.stringify({
          code:    'NO_SUBSCRIPTION',
          message: 'An active subscription or a single errand purchase is required to create an errand.',
        }),
      );
    }

    // A single_errand credit allows exactly 1 errand after the payment date.
    const errandsAfterPayment = await this.repo
      .createQueryBuilder('e')
      .where('e.userId = :userId',        { userId })
      .andWhere('e.status != :cancelled', { cancelled: 'cancelled' })
      .andWhere('e.createdAt > :paid',    { paid: singlePayment.createdAt })
      .andWhere('e.isDeleted = :del',     { del: false })
      .getCount();

    if (errandsAfterPayment >= 1) {
      throw new ForbiddenException(
        JSON.stringify({
          code:    'SINGLE_ERRAND_USED',
          message: 'Your single errand credit has already been used. Purchase another or subscribe to a plan.',
        }),
      );
    }
  }

  // ── Business hours & rider assignment ───────────────────────────

  // Returns the current hour (0-23) in the Columbus, Indiana timezone.
  private businessHour(): number {
    return parseInt(
      new Intl.DateTimeFormat('en-US', {
        hour:     'numeric',
        hour12:   false,
        timeZone: 'America/Indiana/Indianapolis',
      }).format(new Date()),
      10,
    );
  }

  private isWithinBusinessHours(): boolean {
    const h = this.businessHour();
    return h >= 9 && h < 17; // 9 AM – 5 PM
  }

  // Runs every day at 9 AM Columbus time — picks up all errands that arrived outside
  // business hours and had no rider assigned yet.
  @Cron('0 9 * * *', { timeZone: 'America/Indiana/Indianapolis' })
  async processQueuedErrands(): Promise<void> {
    this.logger.log('[Cron 9am] Processing queued (unassigned) errands…');
    const queued = await this.repo.find({
      where: {
        riderId:   IsNull(),
        isDeleted: false,
        status:    Not('cancelled') as any,
      },
    });
    for (const errand of queued) {
      await this.autoAssignRider(errand);
    }
    this.logger.log(`[Cron 9am] Processed ${queued.length} queued errand(s).`);
  }

  async autoAssignRider(errand: Errand): Promise<void> {
    const bypassHours = process.env.BYPASS_BUSINESS_HOURS === 'true';
    if (!bypassHours && !this.isWithinBusinessHours()) {
      this.logger.log(
        `Errand ${errand.id} queued — outside business hours ` +
        `(current hour: ${this.businessHour()}, window: 9–17 ET). ` +
        `Set BYPASS_BUSINESS_HOURS=true to skip this check in dev.`,
      );
      return;
    }

    // Use ET midnight as the day boundary so the 3/day limit matches the business timezone.
    const etNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Indiana/Indianapolis' }));
    const todayStart = new Date(etNow);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const runners = await this.userRepo.find({
      where: { role: 'runner', isDeleted: false },
    });
    if (!runners.length) return;

    const counts = await Promise.all(
      runners.map(async (r) => {
        const count = await this.repo.count({
          where: {
            riderId:    r.id,
            isDeleted:  false,
            riderAssignedAt: Between(todayStart, todayEnd),
            status:     Not('cancelled'),
          },
        });
        return { runner: r, count };
      }),
    );

    const available = counts
      .filter((c) => c.count < 3)
      .sort((a, b) => a.count - b.count);

    if (!available.length) {
      this.logger.warn(`No available runners for errand ${errand.id} — all at daily limit`);
      return;
    }

    const assigned = available[0].runner;
    await this.repo.update(errand.id, {
      riderId:         assigned.id,
      riderAssignedAt: new Date(),
    });
    this.logger.log(`Errand ${errand.id} auto-assigned to runner ${assigned.email}`);
  }
}
