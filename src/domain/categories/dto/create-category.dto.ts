import { CURRENCY_CODES } from '@shared/domain/constants/currency.const';
import type { TcurrencyCode } from '@shared/domain/types/currencyCode.type';
import { IsIn, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @MaxLength(50)
  color: string;

  @IsString()
  @MaxLength(100)
  emoji: string;

  @IsUUID('4')
  userId: string;

  @IsIn(CURRENCY_CODES)
  @MaxLength(3)
  currency: TcurrencyCode;
}
