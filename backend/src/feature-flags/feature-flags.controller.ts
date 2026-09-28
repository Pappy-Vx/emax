import { Controller, Get, Param } from '@nestjs/common';
import { FeatureFlagsService } from './feature-flags.service';

@Controller('feature-flags')
export class FeatureFlagsController {
  constructor(private readonly ffService: FeatureFlagsService) {}

  /**
   * GET /api/v1/feature-flags
   *
   * Called by the Next.js frontend's fetchRemoteFlags() in src/lib/features.js.
   * Returns the full flag map. Deploy-time env vars on the API server override
   * the baked-in Next.js defaults without a frontend rebuild.
   *
   * Example response:
   *   { "pricing": true, "dashboard": true, "bookingForm": true, ... }
   */
  @Get()
  getAll() {
    return this.ffService.getFlags();
  }

  /**
   * GET /api/v1/feature-flags/:key
   * Quick single-flag check — useful for internal tooling.
   */
  @Get(':key')
  getOne(@Param('key') key: string) {
    const flags = this.ffService.getFlags();
    const value = flags[key as keyof typeof flags];
    return { key, enabled: value ?? false };
  }
}
