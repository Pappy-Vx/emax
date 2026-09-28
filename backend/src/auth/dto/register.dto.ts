import {
  IsEmail, IsString, MinLength, MaxLength,
  IsOptional, Matches, IsPhoneNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsString({ message: 'Name must be a string.' })
  @MinLength(2, { message: 'Name must be at least 2 characters.' })
  @MaxLength(80, { message: 'Name must be 80 characters or fewer.' })
  @Transform(({ value }) => (value as string).trim())
  name: string;

  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @Transform(({ value }) => (value as string).toLowerCase().trim())
  email: string;

  @IsString()
  @MinLength(8,  { message: 'Password must be at least 8 characters.' })
  @MaxLength(128, { message: 'Password is too long.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  password: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9\s\-().]{7,20}$/, { message: 'Please enter a valid phone number.' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  referredBy?: string;
}
