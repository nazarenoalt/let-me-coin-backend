import { currencyType } from '../types/currency.type';
import { Money } from '../value-objects/Money';

export interface IMoney {
  amount: number;
  currency: currencyType;

  getAmount(): string; // returns a float amount 100.70 ✅
  getAbsoluteAmount(): number; // returns a crude amount 10070✅
  getCurrency(): { code: string; symbol: string }; // returns currency code ✅

  add(other: Money): Money; // returns a new Money object with the sum of the current object amount and the other object amount ✅
  subtract(other: Money): Money; // same as above but with subtract ✅
  equals(other: Money): boolean; // compares two money objects ✅
  assertSameCurrency(other: Money): void; // compares the current object currency with other object currency ✅
  formatToInteger(value: string): number; // ✅
  formatToString(value: number): string; // ✅
}
