import { CURRENCY } from '@shared/domain/constants/currency.const';
import { currencyCode } from '@shared/domain/types/currencyCode.type';
import { IMoney } from '../interfaces/money.interface';
import { BadRequestException } from '@nestjs/common';
import { currencyType } from '../types/currency.type';

export class Money implements IMoney {
  private amount: number;
  private readonly currency: currencyType;

  constructor(amount: string, currency: currencyCode) {
    this.currency = CURRENCY[currency];
    this.amount = this.formatAmount(amount);
  }

  getAmount() {
    if (this.currency.exponent === 0) return this.amount.toString();

    const str = this.amount.toString();
    const index = str.length - this.currency.exponent;

    return str.slice(0, index) + '.' + str.slice(index);
  }

  getAbsoluteAmount() {
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
