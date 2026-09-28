import {
  IsString, IsNotEmpty, IsIn, IsOptional,
  ValidateIf, Matches, MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class ProcessPaymentDto {
  @IsString()
  @IsNotEmpty({ message: 'Plan ID must not be empty.' })
  @IsIn(['individual', 'family', 'business'], { message: 'Invalid plan. Choose individual, family, or business.' })
  planId: string;

  @IsString()
  @IsIn(['monthly', 'yearly'], { message: 'Billing cycle must be monthly or yearly.' })
  billingCycle: 'monthly' | 'yearly' = 'monthly';

  @IsString()
  @IsIn(['card', 'google_pay', 'apple_pay'], { message: 'Payment method must be card, google_pay, or apple_pay.' })
  paymentMethod: 'card' | 'google_pay' | 'apple_pay';

  // ── Card fields (required when paymentMethod is 'card') ──────────

  @ValidateIf((o: ProcessPaymentDto) => o.paymentMethod === 'card')
  @IsString()
  @Matches(/^\d{16}$/, { message: 'Card number must be exactly 16 digits.' })
  @Transform(({ value }) => (value as string).replace(/\s/g, ''))
  cardNumber?: string;

  @ValidateIf((o: ProcessPaymentDto) => o.paymentMethod === 'card')
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Expiry must be in MM/YY format.' })
  cardExpiry?: string;

  @ValidateIf((o: ProcessPaymentDto) => o.paymentMethod === 'card')
  @IsString()
  @Matches(/^\d{3,4}$/, { message: 'CVV must be 3 or 4 digits.' })
  cardCvv?: string;

  @ValidateIf((o: ProcessPaymentDto) => o.paymentMethod === 'card')
  @IsString()
  @IsNotEmpty({ message: 'Cardholder name must not be empty.' })
  @MaxLength(100)
  @Transform(({ value }) => (value as string).trim())
  cardholderName?: string;

  // ── Wallet fields (required when paymentMethod is google_pay or apple_pay) ──

  @ValidateIf((o: ProcessPaymentDto) => ['google_pay', 'apple_pay'].includes(o.paymentMethod))
  @IsString()
  @IsNotEmpty({ message: 'Payment token must not be empty.' })
  paymentToken?: string;
}
