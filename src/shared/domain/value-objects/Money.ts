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
    this.amount = this.formatToInteger(amount);
  }

  // Data access methods
  getAmount() {
    if (this.currency.exponent === 0) return this.amount.toString();

    const str = this.amount.toString();
    const index = str.length - this.currency.exponent;

    return str.slice(0, index) + '.' + str.slice(index);
  }

  getAbsoluteAmount() {
    return this.amount;
  }

  getCurrency() {
    return { code: this.currency.code, symbol: this.currency.symbol };
  }

  // Operations
  add(other: Money) {
    if (!this.assertSameCurrency(other)) {
      throw new BadRequestException(
        `To sum two money values the currency must be the same.`,
      );
    }
    const result = this.amount + other.getAbsoluteAmount();
    return new Money(this.formatToString(result), this.currency.code);
  }

  subtract(other: Money) {
    const result = this.amount - other.getAbsoluteAmount();
    if (result < 0) {
      throw new BadRequestException(
        `The result of a subtract cannot be negative`,
      );
    }
    return new Money(this.formatToString(result), this.currency.code);
  }

  equals(other: Money): boolean {
    return (
      this.amount === other.getAbsoluteAmount() &&
      this.currency.code === other.getCurrency().code
    );
  }

  assertSameCurrency(other: Money) {
    return this.currency.code === other.getCurrency().code;
  }
  private formatToInteger(value: string): number {
    // TODO: manejar edge case monedas sin exponente
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

  private formatToString(value: number) {
    const { exponent } = this.currency;
    let str = value.toString();

    if (exponent === 0) return str;

    //add zeros if the number received has les characters than the minimum needed (1 + exponent, 0.xx)
    for (let i = 0; i <= exponent - str.length; i++) {
      str += '0';
    }

    const index = str.length - exponent;
    return str.slice(0, index) + '.' + str.slice(index);
  }
}
