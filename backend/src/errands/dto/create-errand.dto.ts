import { IsString, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreateErrandDto {
  @IsString()
  type: string;

  @IsString()
  fromAddress: string;

  @IsString()
  toAddress: string;

  @IsDateString()
  scheduledAt: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  recurringFrequency?: string;
}
