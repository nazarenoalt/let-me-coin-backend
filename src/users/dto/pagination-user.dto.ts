import { IsNumber, IsOptional, IsPositive, Max } from 'class-validator';

export class PaginationUserDto {
  @IsNumber()
  @Max(50)
  @IsPositive()
  @IsOptional()
  limit: number;

  @IsNumber()
  @Max(50)
  @IsPositive()
  @IsOptional()
  offset: number;
}
