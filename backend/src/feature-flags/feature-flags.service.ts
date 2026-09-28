import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface FeatureFlags {
  pricing:       boolean;
  dashboard:     boolean;
  bookingForm:   boolean;
  liveRouteCard: boolean;
  blog:          boolean;
  partners:      boolean;
}

const bool = (val: string | undefined, fallback = true): boolean => {
  if (val === undefined) return fallback;
  return val.toLowerCase() !== 'false' && val !== '0';
};

@Injectable()
export class FeatureFlagsService {
  constructor(private readonly cfg: ConfigService) {}

  getFlags(): FeatureFlags {
    return {
      pricing:       bool(this.cfg.get('FF_PRICING'),       true),
      dashboard:     bool(this.cfg.get('FF_DASHBOARD'),     true),
      bookingForm:   bool(this.cfg.get('FF_BOOKING_FORM'),  true),
      liveRouteCard: bool(this.cfg.get('FF_LIVE_ROUTE'),    true),
      blog:          bool(this.cfg.get('FF_BLOG'),          true),
      partners:      bool(this.cfg.get('FF_PARTNERS'),      true),
    };
  }

  getFlag(key: keyof FeatureFlags): boolean {
    return this.getFlags()[key] ?? true;
  }
}
