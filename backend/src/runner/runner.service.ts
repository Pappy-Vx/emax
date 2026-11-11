import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Errand, TRACKABLE_STATUSES } from '../errands/entities/errand.entity';
import { User } from '../users/entities/user.entity';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ErrandsService } from '../errands/errands.service';

const RUNNER_SETTABLE_STATUSES = ['confirmed', 'picked-up', 'on-the-way'] as const;
type RunnerSettableStatus = (typeof RUNNER_SETTABLE_STATUSES)[number];

@Injectable()
export class RunnerService {
  constructor(
    @InjectRepository(Errand) private readonly errandRepo: Repository<Errand>,
    @InjectRepository(User)   private readonly userRepo: Repository<User>,
    private readonly errandsService: ErrandsService,
  ) {}

  // Remove code from any errand object before returning to a runner — the customer
  // gives it verbally at delivery; the runner must never see it in advance.
  private stripCode(errand: Errand): Errand {
    const safe = { ...errand } as any;
    delete safe.code;
    return safe as Errand;
  }

  private stripCodeMany(errands: Errand[]): Errand[] {
    return errands.map((e) => this.stripCode(e));
  }

  // Returns true once the scheduled time has passed by at least 1 minute.
  private isScheduledTimeReached(errand: Errand): boolean {
    if (!errand.scheduledAt) return true;
    return Date.now() >= new Date(errand.scheduledAt).getTime() + 60_000;
  }

  async getMyErrands(runnerId: string): Promise<Errand[]> {
    const errands = await this.errandRepo.find({
      where:     { riderId: runnerId, isDeleted: false },
      order:     { riderAssignedAt: 'DESC' },
      relations: ['user'],
    });
    return this.stripCodeMany(errands);
  }

  async getErrandDetail(runnerId: string, errandId: string): Promise<Errand & { customer: User }> {
    const errand = await this.errandRepo.findOne({
      where:     { id: errandId, isDeleted: false },
      relations: ['user'],
    });
    if (!errand) throw new NotFoundException('Errand not found.');
    if (errand.riderId !== runnerId) throw new ForbiddenException('Not your errand.');
    return this.stripCode(errand) as Errand & { customer: User };
  }

  async completeErrand(runnerId: string, errandId: string, code: string): Promise<Errand> {
    const errand = await this.errandRepo.findOneBy({ id: errandId, isDeleted: false });
    if (!errand) throw new NotFoundException('Errand not found.');
    if (errand.riderId !== runnerId) throw new ForbiddenException('Not your errand.');
    if (['completed', 'cancelled'].includes(errand.status)) {
      throw new BadRequestException('Errand is already finalised.');
    }
    if (!this.isScheduledTimeReached(errand)) {
      const scheduled = new Date(errand.scheduledAt).toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
      });
      throw new BadRequestException(
        `This errand is scheduled for ${scheduled}. It cannot be completed.`,
      );
    }
    if (errand.cancellationRequested) {
      throw new BadRequestException('This errand has a pending cancellation request. Wait for admin review.');
    }
    if (errand.code !== code) {
      throw new BadRequestException('Incorrect customer code. Please ask the customer for their 4-digit confirmation code.');
    }
    // Goes through ErrandsService so the customer is notified and earns loyalty points.
    return this.stripCode(await this.errandsService.complete(errandId));
  }

  async updateLocation(runnerId: string, errandId: string, dto: UpdateLocationDto): Promise<{ sharedAt: Date }> {
    const errand = await this.errandRepo.findOneBy({ id: errandId, isDeleted: false });
    if (!errand) throw new NotFoundException('Errand not found.');
    if (errand.riderId !== runnerId) throw new ForbiddenException('Not your errand.');
    if (!TRACKABLE_STATUSES.includes(errand.status)) {
      throw new BadRequestException('Location sharing is only available while the errand is in progress.');
    }
    const sharedAt = new Date();
    await this.errandRepo.update(errandId, {
      runnerLat:        dto.lat,
      runnerLng:        dto.lng,
      runnerAccuracy:   dto.accuracy != null ? Math.round(dto.accuracy) : null,
      runnerLocationAt: sharedAt,
    });
    return { sharedAt };
  }

  async updateStatus(runnerId: string, errandId: string, status: RunnerSettableStatus): Promise<Errand> {
    // Completion must go through completeErrand (customer code check); cancellation through a request.
    if (!RUNNER_SETTABLE_STATUSES.includes(status)) {
      throw new BadRequestException(`Status must be one of: ${RUNNER_SETTABLE_STATUSES.join(', ')}.`);
    }
    const errand = await this.errandRepo.findOneBy({ id: errandId, isDeleted: false });
    if (!errand) throw new NotFoundException('Errand not found.');
    if (errand.riderId !== runnerId) throw new ForbiddenException('Not your errand.');
    if (['completed', 'cancelled'].includes(errand.status)) {
      throw new BadRequestException('Errand is already finalised.');
    }
    if (!this.isScheduledTimeReached(errand)) {
      const scheduled = new Date(errand.scheduledAt).toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
      });
      throw new BadRequestException(
        `This errand is scheduled for ${scheduled}. Status cannot be updated.`,
      );
    }
    if (errand.cancellationRequested) {
      throw new BadRequestException('This errand has a pending cancellation request. Status cannot be changed.');
    }
    // Goes through ErrandsService so the customer gets an email + in-app notification.
    return this.stripCode(await this.errandsService.updateStatus(errandId, status));
  }

  async requestCancellation(runnerId: string, errandId: string, reason: string): Promise<Errand> {
    const errand = await this.errandRepo.findOneBy({ id: errandId, isDeleted: false });
    if (!errand) throw new NotFoundException('Errand not found.');
    if (errand.riderId !== runnerId) throw new ForbiddenException('Not your errand.');
    if (['completed', 'cancelled'].includes(errand.status)) {
      throw new BadRequestException('This errand is already finalised.');
    }
    if (errand.cancellationRequested) {
      throw new BadRequestException('A cancellation request is already pending for this errand.');
    }
    if (!reason?.trim()) {
      throw new BadRequestException('A reason is required to request cancellation.');
    }
    await this.errandRepo.update(errandId, {
      cancellationRequested:     true,
      cancellationRequestReason: reason.trim(),
      cancellationRequestedAt:   new Date(),
    });
    const updated = await this.errandRepo.findOne({ where: { id: errandId }, relations: ['user'] }) as Errand;
    return this.stripCode(updated);
  }
}
