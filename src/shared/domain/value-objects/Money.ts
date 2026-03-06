import { CURRENCY } from '@shared/domain/constants/currency.const';
import { TcurrencyCode } from '@shared/domain/types/currencyCode.type';
import { IMoney } from '../interfaces/money.interface';
import { BadRequestException } from '@nestjs/common';
import { currencyType } from '../types/currency.type';

export class Money implements IMoney {
  readonly _amount: number;
  readonly _currency: currencyType;

  constructor(amount: number, currency: TcurrencyCode) {
    this.checkIfValidAmountValue(amount);
    this._currency = CURRENCY[currency];
    this._amount = amount;
  }

  // Data access methods
  getAmount() {
    return this._amount;
  }

  getCurrency() {
    return this._currency;
  }

  toJson() {
    return {
      amount: this._amount,
      currency: this._currency,
    };
  }

  getFormattedAmount(): string {
    this.checkIfValidAmountValue(this._amount);

    const exponent = this._currency.exponent;
    if (exponent === 0) return this._amount.toString();
    const str = this._amount.toString().padStart(exponent + 1, '0');
    const index = str.length - exponent;
    return str.slice(0, index) + '.' + str.slice(index);
  }

  // Operations
  add(other: Money) {
    if (!this.hasSameCurrency(other)) {
      throw new BadRequestException(
        `To sum two money values the currency must be the same.`,
      );
    }
    const result = this._amount + other.getAmount();
    return new Money(result, this._currency.code);
  }

  subtract(other: Money) {
    if (!this.hasSameCurrency(other)) {
      throw new BadRequestException(
        `To subtract two money values the currency must be the same.`,
      );
    }

    const result = this._amount - other.getAmount();

    if (result < 0) {
      throw new BadRequestException(
        `The result of a subtract cannot be negative`,
      );
    }
    return new Money(result, this._currency.code);
  }

  equals(other: Money): boolean {
    return (
      this._amount === other.getAmount() &&
      this._currency.code === other.getCurrency().code
    );
  }

  hasSameCurrency(other: Money): boolean {
    return this._currency.code === other.getCurrency().code;
  }

  checkIfValidAmountValue(amount: number) {
    if (amount < 0)
      throw new BadRequestException(
        `Amount cannot be a negative number (current value: ${amount})`,
      );
    if (!Number.isInteger(amount))
      throw new BadRequestException(
        `The number must be an integer (current value: ${amount})`,
      );
  }
}
