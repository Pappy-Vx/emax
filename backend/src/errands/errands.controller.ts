import {
  Controller, Get, Post, Patch, Param,
  Body, UseGuards,
} from '@nestjs/common';
import { ErrandsService } from './errands.service';
import { CreateErrandDto } from './dto/create-errand.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('errands')
@UseGuards(JwtAuthGuard)
export class ErrandsController {
  constructor(private readonly errandsService: ErrandsService) {}

  /** GET /api/v1/errands */
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.errandsService.findForUser(user.id);
  }

  /** POST /api/v1/errands */
  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateErrandDto) {
    return this.errandsService.create(user.id, dto);
  }

  /** GET /api/v1/errands/:id */
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.errandsService.findOne(id, user.id);
  }

  /** PATCH /api/v1/errands/:id/cancel */
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: User) {
    return this.errandsService.cancel(id, user.id);
  }
}
