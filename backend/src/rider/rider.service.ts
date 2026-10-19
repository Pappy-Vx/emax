import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Errand } from '../errands/entities/errand.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RiderService {
  constructor(
    @InjectRepository(Errand) private readonly errandRepo: Repository<Errand>,
    @InjectRepository(User)   private readonly userRepo: Repository<User>,
  ) {}

  // Remove code from any errand object before returning to a rider — the customer
  // gives it verbally at delivery; the rider must never see it in advance.
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

  async getMyErrands(riderId: string): Promise<Errand[]> {
    const errands = await this.errandRepo.find({
      where:     { riderId, isDeleted: false },
      order:     { riderAssignedAt: 'DESC' },
      relations: ['user'],
    });
    return this.stripCodeMany(errands);
  }

  async getErrandDetail(riderId: string, errandId: string): Promise<Errand & { customer: User }> {
    const errand = await this.errandRepo.findOne({
      where:     { id: errandId, isDeleted: false },
      relations: ['user'],
    });
    if (!errand) throw new NotFoundException('Errand not found.');
    if (errand.riderId !== riderId) throw new ForbiddenException('Not your errand.');
    return this.stripCode(errand) as Errand & { customer: User };
  }

  async completeErrand(riderId: string, errandId: string, code: string): Promise<Errand> {
    const errand = await this.errandRepo.findOneBy({ id: errandId, isDeleted: false });
    if (!errand) throw new NotFoundException('Errand not found.');
    if (errand.riderId !== riderId) throw new ForbiddenException('Not your errand.');
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
    await this.errandRepo.update(errandId, { status: 'completed' });
    return this.stripCode(await this.errandRepo.findOneBy({ id: errandId }) as Errand);
  }

  async updateStatus(riderId: string, errandId: string, status: 'confirmed' | 'picked-up' | 'on-the-way'): Promise<Errand> {
    const errand = await this.errandRepo.findOneBy({ id: errandId, isDeleted: false });
    if (!errand) throw new NotFoundException('Errand not found.');
    if (errand.riderId !== riderId) throw new ForbiddenException('Not your errand.');
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
    await this.errandRepo.update(errandId, { status });
    return this.stripCode(await this.errandRepo.findOneBy({ id: errandId }) as Errand);
  }

  async requestCancellation(riderId: string, errandId: string, reason: string): Promise<Errand> {
    const errand = await this.errandRepo.findOneBy({ id: errandId, isDeleted: false });
    if (!errand) throw new NotFoundException('Errand not found.');
    if (errand.riderId !== riderId) throw new ForbiddenException('Not your errand.');
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
