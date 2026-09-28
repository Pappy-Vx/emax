import {
  IsString, IsOptional, MaxLength,
  IsBoolean, Matches, IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Transform(({ value }) => (value as string).trim())
  label?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @Transform(({ value }) => (value as string).trim())
  line?: string;

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
