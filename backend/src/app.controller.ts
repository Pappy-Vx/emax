import { Controller, Get } from '@nestjs/common';
import { PLANS } from './common/constants/plans.constant';

@Controller()
export class AppController {
  /** GET /api/v1/health */
  @Get('health')
  health() {
    return { status: 'ok', ts: new Date().toISOString() };
  }

  /**
   * GET /api/v1/plans
   * Returns all subscription plans. Used by the frontend pricing and checkout pages.
   */
  @Get('plans')
  getPlans() {
    return PLANS;
  }
}
