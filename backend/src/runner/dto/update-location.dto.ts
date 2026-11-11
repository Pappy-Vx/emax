import { IsLatitude, IsLongitude, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateLocationDto {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lng: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100_000)
  accuracy?: number;
}
