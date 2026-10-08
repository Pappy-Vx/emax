import { IsString, IsIn, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @IsIn(['new_subscription', 'plan_switch', 'single_errand'], { message: 'Invalid session type.' })
  type: string;

  @IsString()
  @IsIn(['individual', 'family', 'business', 'single_errand'], { message: 'Invalid plan ID.' })
  planId: string;

  @IsString()
  @IsIn(['monthly', 'yearly'], { message: 'Billing cycle must be monthly or yearly.' })
  @IsOptional()
  billingCycle?: 'monthly' | 'yearly';
}
