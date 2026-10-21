import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RunnerService } from './runner.service';
import { CompleteErrandDto } from './dto/complete-errand.dto';

@Controller('runner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('runner')
export class RunnerController {
  constructor(private readonly runnerSvc: RunnerService) {}

  @Get('errands')
  getMyErrands(@CurrentUser() user: any) {
    return this.runnerSvc.getMyErrands(user.id);
  }

  @Get('errands/:id')
  getErrandDetail(@CurrentUser() user: any, @Param('id') id: string) {
    return this.runnerSvc.getErrandDetail(user.id, id);
  }

  @Post('errands/:id/complete')
  completeErrand(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: CompleteErrandDto,
  ) {
    return this.runnerSvc.completeErrand(user.id, id, dto.code);
  }

  @Patch('errands/:id/status')
  updateStatus(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('status') status: 'confirmed' | 'picked-up' | 'on-the-way',
  ) {
    return this.runnerSvc.updateStatus(user.id, id, status);
  }

  @Post('errands/:id/cancel-request')
  requestCancellation(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.runnerSvc.requestCancellation(user.id, id, reason);
  }
}
