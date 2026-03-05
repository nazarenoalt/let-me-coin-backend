import { Money } from '@shared/domain/value-objects/Money';
import { Transform } from 'class-transformer';
import {
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
  @Transform(({ value }) => new Money(value.amount, value.currency))
  amount: Money;

  @IsUUID()
  @IsNotEmpty()
  accountId: string;
}
