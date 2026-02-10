import type { currencyCode } from '@domain/types/currencyCode.type';
import { CURRENCY } from '@domain/constants/currency.const';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(Object.keys(CURRENCY))
  currency: currencyCode;

  // TODO: Remove this after auth module is created and implemented.
  @IsString()
  userId: string;
}
