import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UsersService } from '../users/users.service';
import { ADDRESS_LIMIT } from '../common/constants/plans.constant';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly repo: Repository<Address>,
    private readonly usersService: UsersService,
  ) {}

  async findForUser(userId: string): Promise<Address[]> {
    return this.repo.find({
      where: { userId },
      order: { isPrimary: 'DESC', createdAt: 'ASC' },
    });
  }

  async create(userId: string, dto: CreateAddressDto): Promise<Address> {
    const user = await this.usersService.findById(userId);

    if (!user.planId) {
      throw new ForbiddenException('An active subscription is required to save addresses.');
    }

    const planLimit = ADDRESS_LIMIT[user.planId] ?? 2;
    const current = await this.repo.count({ where: { userId } });

    if (current >= planLimit) {
      throw new BadRequestException(
        `Your plan allows up to ${planLimit} saved address${planLimit === 1 ? '' : 'es'}. Upgrade to add more.`,
      );
    }

    // If this is the first address or isPrimary requested, set it as primary
    const makePrimary = dto.isPrimary || current === 0;

    if (makePrimary) {
      await this.repo.update({ userId }, { isPrimary: false });
    }

    const address = this.repo.create({ userId, ...dto, isPrimary: makePrimary });
    return this.repo.save(address);
  }

  async update(id: string, userId: string, dto: UpdateAddressDto): Promise<Address> {
    const address = await this.findOne(id, userId);

    if (dto.isPrimary) {
      await this.repo.update({ userId }, { isPrimary: false });
    }

    Object.assign(address, dto);
    return this.repo.save(address);
  }

  async remove(id: string, userId: string): Promise<void> {
    const address = await this.findOne(id, userId);
    await this.repo.remove(address);
  }

  async setPrimary(id: string, userId: string): Promise<Address> {
    await this.findOne(id, userId);
    await this.repo.update({ userId }, { isPrimary: false });
    await this.repo.update({ id, userId }, { isPrimary: true });
    return this.findOne(id, userId);
  }

  private async findOne(id: string, userId: string): Promise<Address> {
    const address = await this.repo.findOneBy({ id });
    if (!address) throw new NotFoundException('Address not found.');
    if (address.userId !== userId) throw new ForbiddenException();
    return address;
  }
}
