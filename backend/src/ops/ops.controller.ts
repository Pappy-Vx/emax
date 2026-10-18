import {
  Controller, Get, Post, Patch, Body, Param, Query,
  UseGuards, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { OpsService } from './ops.service';
import { CreateRiderDto } from './dto/create-rider.dto';
import * as bcrypt from 'bcrypt';

@Controller('ops')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class OpsController {
  constructor(private readonly ops: OpsService) {}

  // ── Errands ─────────────────────────────────────────────────────

  @Get('errands')
  listErrands(
    @Query('page',     new DefaultValuePipe(1),  ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('search')   search?: string,
    @Query('status')   status?: string,
    @Query('from')     from?: string,
    @Query('to')       to?: string,
  ) {
    return this.ops.listErrands({ page, pageSize, search, status, from, to });
  }

  @Patch('errands/:id/override')
  overrideErrand(
    @Param('id') id: string,
    @Body('action') action: 'complete' | 'cancel',
  ) {
    return this.ops.overrideErrand(id, action);
  }

  @Patch('errands/:id/assign')
  assignRider(
    @Param('id') errandId: string,
    @Body('riderId') riderId: string,
  ) {
    return this.ops.assignRider(errandId, riderId);
  }

  // ── Customers ───────────────────────────────────────────────────

  @Get('customers')
  listCustomers(
    @Query('page',      new DefaultValuePipe(1),  ParseIntPipe) page: number,
    @Query('pageSize',  new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('search')    search?: string,
    @Query('defaulted') defaulted?: string,
    @Query('from')      from?: string,
    @Query('to')        to?: string,
  ) {
    const defaultedBool = defaulted === 'true' ? true : defaulted === 'false' ? false : undefined;
    return this.ops.listCustomers({ page, pageSize, search, defaulted: defaultedBool, from, to });
  }

  // ── Riders ──────────────────────────────────────────────────────

  @Get('riders')
  listRiders(
    @Query('page',     new DefaultValuePipe(1),  ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('search')   search?: string,
  ) {
    return this.ops.listRiders({ page, pageSize, search });
  }

  @Post('riders')
  async createRider(@Body() dto: CreateRiderDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12);
    return this.ops.createRider({ name: dto.name, email: dto.email, passwordHash });
  }

  // ── Cancellation requests ────────────────────────────────────────

  @Get('cancellations')
  listCancellationRequests() {
    return this.ops.listCancellationRequests();
  }

  @Patch('errands/:id/cancellation-approve')
  approveCancellation(@Param('id') id: string) {
    return this.ops.approveCancellation(id);
  }

  @Patch('errands/:id/cancellation-deny')
  denyCancellation(@Param('id') id: string) {
    return this.ops.denyCancellation(id);
  }
}
