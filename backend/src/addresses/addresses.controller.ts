import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  /** GET /api/v1/addresses */
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.addressesService.findForUser(user.id);
  }

  /** POST /api/v1/addresses */
  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(user.id, dto);
  }

  /** PATCH /api/v1/addresses/:id */
  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser() user: User, @Body() dto: UpdateAddressDto) {
    return this.addressesService.update(id, user.id, dto);
  }

  /** DELETE /api/v1/addresses/:id */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.addressesService.remove(id, user.id);
  }

  /** PATCH /api/v1/addresses/:id/primary */
  @Patch(':id/primary')
  setPrimary(@Param('id') id: string, @CurrentUser() user: User) {
    return this.addressesService.setPrimary(id, user.id);
  }
}
