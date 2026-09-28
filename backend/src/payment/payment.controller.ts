import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * POST /api/v1/payment/process
   * Accepts card, Google Pay, or Apple Pay. Validates the plan and
   * routes to the appropriate payment handler. Updates the user's plan on success.
   */
  @Post('process')
  process(@CurrentUser() user: User, @Body() dto: ProcessPaymentDto) {
    return this.paymentService.processPayment(user.id, dto);
  }
}
