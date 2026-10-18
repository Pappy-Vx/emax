import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Errand } from '../errands/entities/errand.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RiderService {
  constructor(
    @InjectRepository(Errand) private readonly errandRepo: Repository<Errand>,
    @InjectRepository(User)   private readonly userRepo: Repository<User>,
  ) {}

  async getMyErrands(riderId: string): Promise<Errand[]> {
    return this.errandRepo.find({
      where:   { riderId, isDeleted: false },
      order:   { riderAssignedAt: 'DESC' },
      relations: ['user'],
    });
  }

  async getErrandDetail(riderId: string, errandId: string): Promise<Errand & { customer: User }> {
    const errand = await this.errandRepo.findOne({
      where:   { id: errandId, isDeleted: false },
      relations: ['user'],
    });
    if (!errand) throw new NotFoundException('Errand not found.');
    if (errand.riderId !== riderId) throw new ForbiddenException('Not your errand.');
    return errand as Errand & { customer: User };
  }

  async completeErrand(riderId: string, errandId: string, code: string): Promise<Errand> {
    const errand = await this.errandRepo.findOneBy({ id: errandId, isDeleted: false });
    if (!errand) throw new NotFoundException('Errand not found.');
    if (errand.riderId !== riderId) throw new ForbiddenException('Not your errand.');
    if (['completed', 'cancelled'].includes(errand.status)) {
      throw new BadRequestException('Errand is already finalised.');
    }
    if (errand.code !== code) {
      throw new BadRequestException('Incorrect customer code. Please ask the customer for their 4-digit confirmation code.');
    }
    await this.errandRepo.update(errandId, { status: 'completed' });
    return this.errandRepo.findOneBy({ id: errandId }) as Promise<Errand>;
  }

  async updateStatus(riderId: string, errandId: string, status: 'confirmed' | 'picked-up' | 'on-the-way'): Promise<Errand> {
    const errand = await this.errandRepo.findOneBy({ id: errandId, isDeleted: false });
    if (!errand) throw new NotFoundException('Errand not found.');
    if (errand.riderId !== riderId) throw new ForbiddenException('Not your errand.');
    await this.errandRepo.update(errandId, { status });
    return this.errandRepo.findOneBy({ id: errandId }) as Promise<Errand>;
  }
}
