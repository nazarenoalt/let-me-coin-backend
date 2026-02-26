import { CURRENCY } from '@shared/domain/constants/currency.const';
import { TcurrencyCode } from '@shared/domain/types/currencyCode.type';
import { IMoney } from '../interfaces/money.interface';
import { BadRequestException } from '@nestjs/common';
import { currencyType } from '../types/currency.type';

export class Money implements IMoney {
  readonly amount: number;
  readonly currency: currencyType;

  constructor(amount: string, currency: TcurrencyCode) {
    this.currency = CURRENCY[currency];
    this.amount = Money.toInteger(amount, this.currency.code);
  }

  // Data access methods
  getAmount() {
    const { amount, currency } = this;
    if (currency.exponent === 0) return amount.toString();

    const str = amount.toString();
    const index = str.length - currency.exponent;

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
    if (!this.hasSameCurrency(other)) {
      throw new BadRequestException(
        `To sum two money values the currency must be the same.`,
      );
    }
    const { amount, currency } = this;
    const result = amount + other.getAbsoluteAmount();
    return new Money(
      Money.toStringWithCents(result, currency.code),
      currency.code,
    );
  }

  subtract(other: Money) {
    if (!this.hasSameCurrency(other)) {
      throw new BadRequestException(
        `To subtract two money values the currency must be the same.`,
      );
    }

    const { amount, currency } = this;
    const result = amount - other.getAbsoluteAmount();

    if (result < 0) {
      throw new BadRequestException(
        `The result of a subtract cannot be negative`,
      );
    }
    return new Money(
      Money.toStringWithCents(result, currency.code),
      currency.code,
    );
  }

  equals(other: Money): boolean {
    return (
      this.amount === other.getAbsoluteAmount() &&
      this.currency.code === other.getCurrency().code
    );
  }

  hasSameCurrency(other: Money) {
    return this.currency.code === other.getCurrency().code;
  }

  static toInteger(value: string, currency: string): number {
    if (!value) {
      throw new BadRequestException('The price must not be empty.');
    }
    const exponent = CURRENCY[currency].exponent;

    if (exponent === 0) return Number.parseInt(value);

    const regex = new RegExp(`^\\d+\\.\\d{${exponent}}$`);
    if (!regex.test(value)) {
      throw new BadRequestException(
        `Invalid price format. Expected ${exponent} decimal places and positive value. E.g. '100.79'`,
      );
    }

    return Number.parseInt(value.replaceAll('.', ''));
  }

  static toStringWithCents(value: number, currency: string): string {
    if (value < 0) {
      throw new BadRequestException(
        `toStringWithCents(): value cannot be negative.`,
      );
    }

    const exponent = CURRENCY[currency].exponent;
    if (exponent === 0) return value.toString();

    const str = value.toString().padStart(exponent + 1, '0');
    const index = str.length - exponent;
    return str.slice(0, index) + '.' + str.slice(index);
  }
}
