import { IsString, IsIn } from 'class-validator';

export class SwitchPlanDto {
  @IsString()
  @IsIn(['individual', 'family', 'business'], { message: 'Invalid plan ID.' })
  planId: string;

  @IsString()
  @IsIn(['monthly', 'yearly'], { message: 'Billing cycle must be monthly or yearly.' })
  billingCycle: 'monthly' | 'yearly';
}
