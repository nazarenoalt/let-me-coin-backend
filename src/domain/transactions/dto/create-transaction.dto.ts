import { CURRENCY_CODES } from '@shared/domain/constants/currency.const';
import { type TcurrencyCode } from '@shared/domain/types/currencyCode.type';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description: string;

  @IsNotEmpty()
  @IsInt()
  amount: number;

  @IsNotEmpty()
  @IsIn(CURRENCY_CODES)
  currency: TcurrencyCode;

  @IsUUID()
  @IsNotEmpty()
  accountId: string;
}
