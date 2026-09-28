import { IsBoolean } from 'class-validator';

export class Update2faDto {
  @IsBoolean({ message: 'twoFaEnabled must be true or false.' })
  twoFaEnabled: boolean;
}
