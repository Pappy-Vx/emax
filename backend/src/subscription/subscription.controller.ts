import {
  Controller, Get, Post, Patch, Body, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SubscriptionService } from './subscription.service';
import { SwitchPlanDto } from './dto/switch-plan.dto';

@UseGuards(JwtAuthGuard)
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /** GET /subscription/me — current active subscription */
  @Get('me')
  me(@CurrentUser() user: { id: string }) {
    return this.subscriptionService.findActive(user.id);
  }

  /** POST /subscription/preview-switch — calculate proration without committing */
  @Post('preview-switch')
  previewSwitch(@CurrentUser() user: { id: string }, @Body() dto: SwitchPlanDto) {
    return this.subscriptionService.previewSwitch(user.id, dto);
  }

  /** POST /subscription/switch — upgrade to a higher plan or monthly → yearly */
  @Post('switch')
  switch(@CurrentUser() user: { id: string }, @Body() dto: SwitchPlanDto) {
    return this.subscriptionService.switchPlan(user.id, dto);
  }

  /** PATCH /subscription/cancel — cancel at the end of the current period */
  @Patch('cancel')
  cancel(@CurrentUser() user: { id: string }) {
    return this.subscriptionService.cancel(user.id);
  }

  /** PATCH /subscription/autorenew — toggle auto-renewal on/off */
  @Patch('autorenew')
  toggleAutoRenew(
    @CurrentUser() user: { id: string },
    @Body('autoRenew') autoRenew: boolean,
  ) {
    return this.subscriptionService.toggleAutoRenew(user.id, autoRenew);
  }
}
