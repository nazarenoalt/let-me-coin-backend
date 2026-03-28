import { COLORS } from '@shared/domain/constants/colors.const';
import { CURRENCY_CODES } from '@shared/domain/constants/currency.const';
import { EMOJIS } from '@shared/domain/constants/emojis.const';
import type { TcurrencyCode } from '@shared/domain/types/currencyCode.type';
import { IsIn, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @MaxLength(50)
  color: COLORS;

  @IsString()
  @MaxLength(50)
  emoji: EMOJIS;

  @IsUUID('4')
  userId: string;

  @IsIn(CURRENCY_CODES)
  @MaxLength(3)
  currency: TcurrencyCode;
}
