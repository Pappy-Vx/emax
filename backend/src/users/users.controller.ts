import {
  Controller, Get, Patch, Body, UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Update2faDto } from './dto/update-2fa.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
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

  // NOTE: planId is intentionally NOT writable by the user.
  // It is set exclusively by PaymentService (new subscription) and
  // SubscriptionService (plan switch). Exposing it here would let any
  // authenticated user assign themselves the Business plan for free.

  /** PATCH /api/v1/users/me/2fa — toggle two-factor authentication */
  @Patch('me/2fa')
  toggle2fa(@CurrentUser() user: User, @Body() dto: Update2faDto) {
    return this.usersService.update2fa(user.id, dto.twoFaEnabled);
  }

  /** PATCH /api/v1/users/me/profile — update phone number */
  @Patch('me/profile')
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }
}
