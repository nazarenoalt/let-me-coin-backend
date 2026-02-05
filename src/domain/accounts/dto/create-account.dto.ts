import type { currencyCode } from '@domain/types/currencyCode.type';
import { CURRENCY } from '@domain/constants/currency.const';
import { IsBoolean, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(Object.keys(CURRENCY))
  currency: currencyCode;

  @IsBoolean()
  isActive: boolean;
}
