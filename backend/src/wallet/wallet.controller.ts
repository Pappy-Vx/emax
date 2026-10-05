import { Controller, Get, Post, Delete, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { WalletService, SaveWalletDto } from './wallet.service';

@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  /** GET /wallet — list all saved payment methods */
  @Get()
  list(@CurrentUser() user: { id: string }) {
    return this.walletService.findForUser(user.id);
  }

  /** POST /wallet — save a new payment method (card, google_pay, apple_pay) */
  @Post()
  save(@CurrentUser() user: { id: string }, @Body() dto: SaveWalletDto) {
    return this.walletService.save(user.id, dto);
  }

  /** PATCH /wallet/:id/default — set as default payment method */
  @Patch(':id/default')
  setDefault(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.walletService.setDefault(id, user.id);
  }

  /** DELETE /wallet/:id — remove a saved payment method */
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.walletService.remove(id, user.id);
  }
}
