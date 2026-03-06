import { Money } from '../value-objects/Money';

export interface IMoney {
  getAmount(): number;
  getFormattedAmount(): string;
  getCurrency(): { code: string; symbol: string; exponent: number };
  add(other: Money): Money;
  subtract(other: Money): Money;
  equals(other: Money): boolean;
  hasSameCurrency(other: Money): void;
}
