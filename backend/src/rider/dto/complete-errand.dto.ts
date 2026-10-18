import { IsString, Length } from 'class-validator';

export class CompleteErrandDto {
  @IsString()
  @Length(4, 4)
  code: string;
}
