import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CheckoutService } from './checkout.service';
import { CreateSessionDto } from './dto/create-session.dto';

@UseGuards(JwtAuthGuard)
@Controller('checkout/sessions')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  /** POST /checkout/sessions — create a server-side checkout session (returns UUID) */
  @Post()
  createSession(@CurrentUser() user: { id: string }, @Body() dto: CreateSessionDto) {
    return this.checkoutService.createSession(user.id, dto);
  }

  /** GET /checkout/sessions/:id — fetch session details for display */
  @Get(':id')
  getSession(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.checkoutService.getSession(id, user.id);
  }
}
