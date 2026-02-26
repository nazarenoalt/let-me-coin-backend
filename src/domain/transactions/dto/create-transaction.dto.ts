import { currencyCodes } from '@shared/domain/constants/currency.const';
import { IsIn, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(currencyCodes)
  currency: string;

  @IsUUID()
  @IsNotEmpty()
  accountId: string;
}
