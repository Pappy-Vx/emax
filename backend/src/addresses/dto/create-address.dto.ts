import {
  IsString, IsNotEmpty, MaxLength,
  IsOptional, IsBoolean, Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty({ message: 'Label must not be empty.' })
  @MaxLength(50, { message: 'Label must be 50 characters or fewer.' })
  @Transform(({ value }) => (value as string).trim())
  label: string;

  @IsString()
  @IsNotEmpty({ message: 'Address line must not be empty.' })
  @MaxLength(200)
  @Transform(({ value }) => (value as string).trim())
  line: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  state?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{5}(-\d{4})?$/, { message: 'Zip code must be in format 12345 or 12345-6789.' })
  zip?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  note?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
