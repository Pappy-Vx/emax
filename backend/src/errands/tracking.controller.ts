import { Controller, Get, Param } from '@nestjs/common';
import { ErrandsService } from './errands.service';

// Public — anyone with the errand's tracking link can follow it, no account needed.
@Controller('track')
export class TrackingController {
  constructor(private readonly errandsService: ErrandsService) {}

  @Get(':token')
  track(@Param('token') token: string) {
    return this.errandsService.getTrackingByToken(token);
  }
}
