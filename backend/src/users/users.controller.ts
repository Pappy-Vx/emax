import {
  Controller, Get, Patch, Body, UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Update2faDto } from './dto/update-2fa.dto';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** GET /api/v1/users/me */
  @Get('me')
  getMe(@CurrentUser() user: User) {
    return user;
  }

  /** PATCH /api/v1/users/me/plan */
  @Patch('me/plan')
  updatePlan(@CurrentUser() user: User, @Body('planId') planId: string) {
    return this.usersService.updatePlan(user.id, planId);
  }

  /** PATCH /api/v1/users/me/2fa — toggle two-factor authentication */
  @Patch('me/2fa')
  toggle2fa(@CurrentUser() user: User, @Body() dto: Update2faDto) {
    return this.usersService.update2fa(user.id, dto.twoFaEnabled);
  }
}
