import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Errand } from '../errands/entities/errand.entity';
import { User } from '../users/entities/user.entity';
import { Subscription, SubscriptionStatus } from '../subscription/entities/subscription.entity';
import { Payment } from '../payment/entities/payment.entity';

export interface PageResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

@Injectable()
export class OpsService {
  constructor(
    @InjectRepository(Errand)     private readonly errandRepo: Repository<Errand>,
    @InjectRepository(User)       private readonly userRepo: Repository<User>,
    @InjectRepository(Subscription) private readonly subRepo: Repository<Subscription>,
    @InjectRepository(Payment)    private readonly paymentRepo: Repository<Payment>,
  ) {}

  // ── Errands ─────────────────────────────────────────────────────

  async listErrands(opts: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    from?: string;
    to?: string;
  }): Promise<PageResult<Errand>> {
    const page     = Math.max(1, opts.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 20));
    const skip     = (page - 1) * pageSize;

    const qb = this.errandRepo.createQueryBuilder('e')
      .leftJoinAndSelect('e.user', 'u')
      .where('e.isDeleted = 0')
      .orderBy('e.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize);

    if (opts.status) qb.andWhere('e.status = :status', { status: opts.status });
    if (opts.search) {
      qb.andWhere(
        '(u.name LIKE :q OR u.email LIKE :q OR e.fromAddress LIKE :q OR e.toAddress LIKE :q OR e.code = :code)',
        { q: `%${opts.search}%`, code: opts.search },
      );
    }
    if (opts.from && opts.to) {
      qb.andWhere('e.createdAt BETWEEN :from AND :to', {
        from: new Date(opts.from),
        to:   new Date(opts.to),
      });
    } else if (opts.from) {
      qb.andWhere('e.createdAt >= :from', { from: new Date(opts.from) });
    } else if (opts.to) {
      qb.andWhere('e.createdAt <= :to', { to: new Date(opts.to) });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, pageSize, pages: Math.ceil(total / pageSize) };
  }

  async overrideErrand(id: string, action: 'complete' | 'cancel'): Promise<Errand> {
    const errand = await this.errandRepo.findOneBy({ id, isDeleted: false });
    if (!errand) throw new NotFoundException('Errand not found.');
    const status = action === 'complete' ? 'completed' : 'cancelled';
    await this.errandRepo.update(id, { status });
    return this.errandRepo.findOneBy({ id }) as Promise<Errand>;
  }

  async assignRider(errandId: string, riderId: string): Promise<Errand> {
    const errand = await this.errandRepo.findOneBy({ id: errandId, isDeleted: false });
    if (!errand) throw new NotFoundException('Errand not found.');
    const rider = await this.userRepo.findOneBy({ id: riderId, isDeleted: false });
    if (!rider || rider.role !== 'runner') throw new BadRequestException('User is not a runner.');
    await this.errandRepo.update(errandId, { riderId, riderAssignedAt: new Date() });
    return this.errandRepo.findOneBy({ id: errandId }) as Promise<Errand>;
  }

  // ── Customers ───────────────────────────────────────────────────

  async listCustomers(opts: {
    page?: number;
    pageSize?: number;
    search?: string;
    defaulted?: boolean;
    from?: string;
    to?: string;
  }): Promise<PageResult<any>> {
    const page     = Math.max(1, opts.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 20));
    const skip     = (page - 1) * pageSize;

    const userQb = this.userRepo.createQueryBuilder('u')
      .where('u.isDeleted = 0')
      .andWhere('u.role = :role', { role: 'customer' })
      .orderBy('u.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize);

    if (opts.search) {
      userQb.andWhere('(u.name LIKE :q OR u.email LIKE :q OR u.phone LIKE :q)', { q: `%${opts.search}%` });
    }
    if (opts.from && opts.to) {
      userQb.andWhere('u.createdAt BETWEEN :from AND :to', { from: new Date(opts.from), to: new Date(opts.to) });
    }

    const [users, total] = await userQb.getManyAndCount();

    const data = await Promise.all(users.map(async (u) => {
      const sub = await this.subRepo.findOne({
        where: { userId: u.id, isDeleted: false },
        order: { createdAt: 'DESC' },
      });
      const lastPayment = await this.paymentRepo.findOne({
        where: { userId: u.id, isDeleted: false },
        order: { createdAt: 'DESC' },
      });
      const isDefaulted = sub?.status === SubscriptionStatus.PAST_DUE;

      return {
        id:           u.id,
        name:         u.name,
        email:        u.email,
        phone:        u.phone,
        createdAt:    u.createdAt,
        planId:       sub?.planId ?? null,
        subStatus:    sub?.status ?? null,
        billingCycle: sub?.billingCycle ?? null,
        periodEnd:    sub?.currentPeriodEnd ?? null,
        isDefaulted,
        lastPaymentMethod: lastPayment?.paymentMethod ?? null,
        lastPaymentAt:     lastPayment?.createdAt ?? null,
      };
    }));

    if (opts.defaulted !== undefined) {
      const filtered = data.filter((d) => d.isDefaulted === opts.defaulted);
      return { data: filtered, total: filtered.length, page, pageSize, pages: Math.ceil(filtered.length / pageSize) };
    }

    return { data, total, page, pageSize, pages: Math.ceil(total / pageSize) };
  }

  // ── Runners / Riders ────────────────────────────────────────────

  async listRiders(opts: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<PageResult<any>> {
    const page     = Math.max(1, opts.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 20));
    const skip     = (page - 1) * pageSize;

    const qb = this.userRepo.createQueryBuilder('u')
      .where('u.isDeleted = 0')
      .andWhere('u.role = :role', { role: 'runner' })
      .orderBy('u.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize);

    if (opts.search) {
      qb.andWhere('(u.name LIKE :q OR u.email LIKE :q)', { q: `%${opts.search}%` });
    }

    const [users, total] = await qb.getManyAndCount();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const data = await Promise.all(users.map(async (u) => {
      const errandsToday = await this.errandRepo.count({
        where: {
          riderId:         u.id,
          isDeleted:       false,
          riderAssignedAt: Between(todayStart, todayEnd),
        },
      });
      const totalCompleted = await this.errandRepo.count({
        where: { riderId: u.id, status: 'completed' as any, isDeleted: false },
      });
      return {
        id:             u.id,
        name:           u.name,
        email:          u.email,
        phone:          u.phone,
        createdAt:      u.createdAt,
        errandsToday,
        totalCompleted,
        atDailyLimit:   errandsToday >= 3,
      };
    }));

    return { data, total, page, pageSize, pages: Math.ceil(total / pageSize) };
  }

  async createRider(dto: { name: string; email: string; passwordHash: string }): Promise<User> {
    const existing = await this.userRepo.findOneBy({ email: dto.email });
    if (existing) throw new BadRequestException('Email already registered.');
    const rider = this.userRepo.create({
      name:         dto.name,
      email:        dto.email,
      passwordHash: dto.passwordHash,
      role:         'runner',
      isVerified:   true,
    });
    return this.userRepo.save(rider);
  }
}
