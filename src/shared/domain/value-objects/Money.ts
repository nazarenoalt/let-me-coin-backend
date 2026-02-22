import { CURRENCY } from '@shared/domain/constants/currency.const';
import { currencyCode } from '@shared/domain/types/currencyCode.type';
import { IMoney } from '../interfaces/money.interface';
import { BadRequestException } from '@nestjs/common';

export class Money implements IMoney {
  private amount: number;
  private readonly currency: CURRENCY;

  constructor(amount: string, currency: currencyCode) {
    this.currency = CURRENCY[currency];
    this.amount = this.formatAmount(amount);
  }

  getAmount() {
    return this.amount;
  }

  private formatAmount(value: string): number {
    if (!value) {
      throw new BadRequestException('The price must not be empty.');
    }

    const regex = new RegExp(`^\\d+\\.\\d{${this.currency.exponent}}$`);
    if (!regex.test(value)) {
      throw new BadRequestException(
        `Invalid price format. Expected ${this.currency.exponent} decimal places. E.g. '100.79'`,
      );
    }

    return Number.parseInt(value.replaceAll('.', ''));
  }
}
