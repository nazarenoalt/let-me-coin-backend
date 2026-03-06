import { BadRequestException } from '@nestjs/common';
import { CURRENCY } from '@shared/domain/constants/currency.const';
import { Money } from '@shared/domain/value-objects/Money';

describe('Money', () => {
  let money: Money;

  beforeEach(() => {
    money = new Money(9999, 'ARS');
  });

  describe('constructor', () => {
    it('should throw if amount is negative', () => {
      expect(() => new Money(-9999, 'ARS')).toThrow(BadRequestException);
    });

    it('should create a Money object with valid amount', () => {
      expect(() => new Money(9999, 'ARS')).not.toThrow();
    });
  });

  describe('getAmount()', () => {
    it('Should return a number 9999', () => {
      expect(money.getAmount()).toBe(9999);
    });
  });

  describe('getFormattedAmount()', () => {
    it(`getAbsoluteAmount() Should return a string '99.99'`, () => {
      expect(money.getFormattedAmount()).toBe('99.99');
    });
  });

  describe('getCurrency() ', () => {});
  it('Should return a json with currency details', () => {
    expect(money.getCurrency()).toStrictEqual({
      code: CURRENCY.ARS.code,
      symbol: CURRENCY.ARS.symbol,
      exponent: CURRENCY.ARS.exponent,
    });
  });

  describe('add()', () => {
    it('Should return a new Money object with the sum of values', () => {
      const otherMoney = new Money(1000, 'ARS');
      const result = new Money(10999, 'ARS');
      expect(money.add(otherMoney).equals(result)).toBe(true);
    });
    it('should throw if currencies are different', () => {
      const otherMoney = new Money(1000, 'USD');
      expect(() => money.add(otherMoney)).toThrow(BadRequestException);
    });
  });

  describe('subtract()', () => {
    it('Should return a new Money object with the subtract of values', () => {
      const otherMoney = new Money(1000, 'ARS');
      const result = new Money(8999, 'ARS');
      expect(money.subtract(otherMoney).equals(result)).toBe(true);
    });
    it('should throw if result is negative', () => {
      const otherMoney = new Money(99999, 'ARS');
      expect(() => money.subtract(otherMoney)).toThrow(BadRequestException);
    });
  });

  describe('equals()', () => {
    it('Should return true if both amount and currency are the same', () => {
      const otherMoney = new Money(9999, 'ARS');
      expect(money.equals(otherMoney)).toBe(true);
    });
    it('Should return false if both amount and currency are different', () => {
      const otherMoney = new Money(1099, 'ARS');
      expect(money.equals(otherMoney)).toBe(false);
    });
  });

  describe('hasSameCurrency()', () => {
    it('Should return true if the currency is the same', () => {
      const otherMoney = new Money(9999, 'ARS');
      expect(money.hasSameCurrency(otherMoney)).toBe(true);
    });
    it('Should return false if the currency is different', () => {
      const otherMoney = new Money(9999, 'USD');
      expect(money.hasSameCurrency(otherMoney)).toBe(false);
    });
  });
});
