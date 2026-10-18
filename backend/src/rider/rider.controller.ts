import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RiderService } from './rider.service';
import { CompleteErrandDto } from './dto/complete-errand.dto';

@Controller('rider')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('runner')
export class RiderController {
  constructor(private readonly riderSvc: RiderService) {}

  @Get('errands')
  getMyErrands(@CurrentUser() user: any) {
    return this.riderSvc.getMyErrands(user.id);
  }

  @Get('errands/:id')
  getErrandDetail(@CurrentUser() user: any, @Param('id') id: string) {
    return this.riderSvc.getErrandDetail(user.id, id);
  }

  @Post('errands/:id/complete')
  completeErrand(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: CompleteErrandDto,
  ) {
    return this.riderSvc.completeErrand(user.id, id, dto.code);
  }

  @Patch('errands/:id/status')
  updateStatus(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('status') status: 'confirmed' | 'picked-up' | 'on-the-way',
  ) {
    return this.riderSvc.updateStatus(user.id, id, status);
  }
}
