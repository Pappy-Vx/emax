import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  /**
   * GET /notifications/me?days=30
   * Returns the authenticated user's notifications for the last N days (default 30).
   */
  @Get('me')
  findMine(
    @CurrentUser() user: { id: string },
    @Query('days') days?: string,
  ) {
    return this.svc.findForUser(user.id, days ? Number(days) : 30);
  }

  /**
   * PATCH /notifications/:id/read
   * Marks a single notification as read.
   */
  @Patch(':id/read')
  markRead(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.svc.markRead(id, user.id);
  }
}
