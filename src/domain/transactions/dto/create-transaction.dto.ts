import { CURRENCY_CODES } from '@shared/domain/constants/currency.const';
import { type TcurrencyCode } from '@shared/domain/types/currencyCode.type';
import {
  IsIn,
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
  @IsString()
  amount: string;

  @IsNotEmpty()
  @IsIn(CURRENCY_CODES)
  currency: TcurrencyCode;

  @IsUUID()
  @IsNotEmpty()
  accountId: string;
}
