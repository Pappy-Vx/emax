import {
  IsString, IsDateString, IsOptional, IsBoolean, IsIn, IsNotEmpty, MaxLength,
} from 'class-validator';
import { ERRAND_SERVICE_TYPES } from '../../common/constants/errand.constant';

export class CreateErrandDto {
  @IsString()
  @IsNotEmpty({ message: 'Service type must not be empty.' })
  @IsIn(ERRAND_SERVICE_TYPES, { message: 'Invalid service type.' })
  type: string;

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

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  recurringFrequency?: string;
}
