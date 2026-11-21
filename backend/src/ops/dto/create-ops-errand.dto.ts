import {
  IsDateString, IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min,
} from 'class-validator';
import {
  ERRAND_CATEGORIES, ERRAND_PAYMENT_STATUSES, ERRAND_SERVICE_TYPES,
} from '../../common/constants/errand.constant';

export class CreateOpsErrandDto {
  @IsString()
  @IsNotEmpty({ message: 'Customer name is required.' })
  @MaxLength(100)
  customerName: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  customerPhone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Customer email is not valid.' })
  customerEmail?: string;

  @IsIn(ERRAND_SERVICE_TYPES, { message: 'Invalid errand type.' })
  type: string;

  @IsIn(ERRAND_CATEGORIES, { message: 'Invalid errand category.' })
  category: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  fromAddress: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  toAddress: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsIn(ERRAND_PAYMENT_STATUSES, { message: 'Payment status must be paid or unpaid.' })
  paymentStatus: 'paid' | 'unpaid';

  // Dollars, e.g. 19.99
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100_000)
  amount?: number;
}
