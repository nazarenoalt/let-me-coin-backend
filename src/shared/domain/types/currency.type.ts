import { CURRENCY } from '../constants/currency.const';
import { currencyCode } from './currencyCode.type';

export type currencyType = (typeof CURRENCY)[currencyCode];
