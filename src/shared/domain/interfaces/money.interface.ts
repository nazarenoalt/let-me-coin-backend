import { currencyType } from '../types/currency.type';
import { currencyCode } from '../types/currencyCode.type';
import { Money } from '../value-objects/Money';

export interface IMoney {
  amount: number;
  currency: currencyType;

  getAmount(): string; // returns a float amount 100.70
  getAbsoluteAmount(): number; // returns a crude amount 10070
  getCurrency(): currencyCode; // returns currency code
  getSymbol(): string; // returns symbol

  add(other: Money): Money; // returns a new Money object with the sum of the current object amount and the other object amount
  substract(other: Money): Money; // same as above but with substract
  format(): string; // returns a formatted string with the amount
  toJson(): { amount: number; currency: currencyCode }; // returns a json to send to database or APIs
  equals(other: Money): boolean; // compares two money objects
  assertSameCurrency(other: Money): void; // compares the current object currency with other object currency
  formatAmount(value: string): number;
}
