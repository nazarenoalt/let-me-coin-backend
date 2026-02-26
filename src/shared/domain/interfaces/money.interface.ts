import { Money } from '../value-objects/Money';

export interface IMoney {
  getAmount(): string;
  getAbsoluteAmount(): number;
  getCurrency(): { code: string; symbol: string };
  add(other: Money): Money;
  subtract(other: Money): Money;
  equals(other: Money): boolean;
  assertSameCurrency(other: Money): void;
}
