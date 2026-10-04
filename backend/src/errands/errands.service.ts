import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Errand } from './entities/errand.entity';
import { CreateErrandDto } from './dto/create-errand.dto';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../services/notification/notification.service';

const POINTS_PER_ERRAND = 20;

@Injectable()
export class ErrandsService {
  private readonly logger = new Logger(ErrandsService.name);

  constructor(
    @InjectRepository(Errand)
    private readonly repo: Repository<Errand>,
    private readonly usersService: UsersService,
    private readonly notifications: NotificationService,
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
    this.notifications.notifyErrandUpdate(user.email, errand.type, 'cancelled').catch(() => {});
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
    this.notifications.notifyErrandUpdate(user.email, errand.type, 'completed').catch(() => {});
    return updated!;
  }

  async updateStatus(id: string, status: Errand['status']): Promise<Errand> {
    const errand = await this.repo.findOneBy({ id });
    if (!errand) throw new NotFoundException('Errand not found.');
    await this.repo.update(id, { status });
    const updated = await this.repo.findOneBy({ id });
    const user = await this.usersService.findById(errand.userId);
    this.logger.log(`[${user.email}] errand status → ${status} (id=${id} type=${errand.type})`);
    this.notifications.notifyErrandUpdate(user.email, errand.type, status).catch(() => {});
    return updated!;
  }
}
