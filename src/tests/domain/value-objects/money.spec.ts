import { BadRequestException } from '@nestjs/common';
import { CURRENCY } from '@shared/domain/constants/currency.const';
import { Money } from '@shared/domain/value-objects/Money';

describe('Money', () => {
  let money: Money;

  beforeEach(() => {
    money = new Money('99.99', 'ARS');
  });

  describe('constructor', () => {
    it('should throw if amount is empty', () => {
      expect(() => new Money('', 'ARS')).toThrow(BadRequestException);
    });

    it('should throw if amount has wrong decimal places', () => {
      expect(() => new Money('99.9', 'ARS')).toThrow(BadRequestException);
    });

    it('should throw if amount has no decimals', () => {
      expect(() => new Money('99', 'ARS')).toThrow(BadRequestException);
    });

    it('should create a Money object with valid amount', () => {
      expect(() => new Money('99.99', 'ARS')).not.toThrow();
    });
  });

  describe('getAmount()', () => {
    it("Should return a string '99.99'", () => {
      expect(money.getAmount()).toBe('99.99');
    });
  });

  describe('getAbsoluteAmount()', () => {
    it('getAbsoluteAmount() Should return a number 9999', () => {
      expect(money.getAbsoluteAmount()).toBe(9999);
    });
  });

  describe('getCurrency() ', () => {});
  it('Should return a json with currency details', () => {
    expect(money.getCurrency()).toStrictEqual({
      code: CURRENCY.ARS.code,
      symbol: CURRENCY.ARS.symbol,
    });
  });

  describe('add()', () => {
    it('Should return a new Money object with the sum of values', () => {
      const otherMoney = new Money('10.00', 'ARS');
      const result = new Money('109.99', 'ARS');
      expect(money.add(otherMoney).equals(result)).toBe(true);
    });
    it('should throw if currencies are different', () => {
      const otherMoney = new Money('10.00', 'USD');
      expect(() => money.add(otherMoney)).toThrow(BadRequestException);
    });
  });

  describe('subtract()', () => {
    it('Should return a new Money object with the subtract of values', () => {
      const otherMoney = new Money('10.00', 'ARS');
      const result = new Money('89.99', 'ARS');
      expect(money.subtract(otherMoney).equals(result)).toBe(true);
    });
    it('should throw if result is negative', () => {
      const otherMoney = new Money('999.99', 'ARS');
      expect(() => money.subtract(otherMoney)).toThrow(BadRequestException);
    });
  });

  describe('equals()', () => {
    it('Should return true if values are the same', () => {
      const otherMoney = new Money('99.99', 'ARS');
      expect(money.equals(otherMoney)).toBe(true);
    });
    it('Should return false if values are different', () => {
      const otherMoney = new Money('10.99', 'ARS');
      expect(money.equals(otherMoney)).toBe(false);
    });
  });

  describe('assertSameCurrency()', () => {
    it('Should return true if the currency is the same', () => {
      const otherMoney = new Money('10.10', 'ARS');
      expect(money.assertSameCurrency(otherMoney)).toBe(true);
    });
    it('Should return false if the currency is different', () => {
      const otherMoney = new Money('10.10', 'USD');
      expect(money.assertSameCurrency(otherMoney)).toBe(false);
    });
  });
});
