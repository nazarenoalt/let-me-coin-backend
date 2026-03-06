import { CURRENCY } from '../constants/currency.const';
import { TcurrencyCode } from './currencyCode.type';

export type currencyType = (typeof CURRENCY)[TcurrencyCode];
