import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Errand } from './entities/errand.entity';
import { CreateErrandDto } from './dto/create-errand.dto';
import { UsersService } from '../users/users.service';
import { NOTIFY } from '../notifications/events/notification.events';
import { NotificationType } from '../notifications/entities/notification.entity';

const POINTS_PER_ERRAND = 20;

@Injectable()
export class ErrandsService {
  private readonly logger = new Logger(ErrandsService.name);

  constructor(
    @InjectRepository(Errand)
    private readonly repo: Repository<Errand>,
    private readonly usersService: UsersService,
    private readonly events: EventEmitter2,
  ) {}

  async create(userId: string, dto: CreateErrandDto): Promise<Errand> {
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
    });
    const saved = await this.repo.save(errand);
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
    const STATUS_EVENTS: Partial<Record<string, StatusMeta>> = {
      confirmed: {
        event: NOTIFY.ERRAND_CONFIRMED,
        type:  NotificationType.ERRAND_CONFIRMED,
        title: 'Errand confirmed',
        body:  `Your ${errand.type} errand has been confirmed and an agent is on it.`,
      },
      picked_up: {
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
}
