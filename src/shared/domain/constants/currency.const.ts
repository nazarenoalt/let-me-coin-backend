export const CURRENCY = {
  // LATAM
  ARS: { code: 'ARS', symbol: '$', exponent: 2 },
  BOB: { code: 'BOB', symbol: 'Bs.', exponent: 2 },
  BRL: { code: 'BRL', symbol: 'R$', exponent: 2 },
  CLP: { code: 'CLP', symbol: '$', exponent: 0 },
  COP: { code: 'COP', symbol: '$', exponent: 2 },
  CRC: { code: 'CRC', symbol: '₡', exponent: 2 },
  CUP: { code: 'CUP', symbol: '$', exponent: 2 },
  DOP: { code: 'DOP', symbol: '$', exponent: 2 },
  GTQ: { code: 'GTQ', symbol: 'Q', exponent: 2 },
  HNL: { code: 'HNL', symbol: 'L', exponent: 2 },
  MXN: { code: 'MXN', symbol: '$', exponent: 2 },
  NIO: { code: 'NIO', symbol: 'C$', exponent: 2 },
  PAB: { code: 'PAB', symbol: 'B/.', exponent: 2 },
  PEN: { code: 'PEN', symbol: 'S/', exponent: 2 },
  PYG: { code: 'PYG', symbol: '₲', exponent: 0 },
  SVC: { code: 'SVC', symbol: '$', exponent: 2 },
  UYU: { code: 'UYU', symbol: '$U', exponent: 2 },
  VES: { code: 'VES', symbol: 'Bs.', exponent: 2 },

  // North America
  USD: { code: 'USD', symbol: '$', exponent: 2 },
  CAD: { code: 'CAD', symbol: '$', exponent: 2 },

  // Europe
  EUR: { code: 'EUR', symbol: '€', exponent: 2 },
  GBP: { code: 'GBP', symbol: '£', exponent: 2 },
  CHF: { code: 'CHF', symbol: 'CHF', exponent: 2 },
  SEK: { code: 'SEK', symbol: 'kr', exponent: 2 },
  NOK: { code: 'NOK', symbol: 'kr', exponent: 2 },
  DKK: { code: 'DKK', symbol: 'kr', exponent: 2 },
  PLN: { code: 'PLN', symbol: 'zł', exponent: 2 },

  // Asia
  JPY: { code: 'JPY', symbol: '¥', exponent: 0 },
  CNY: { code: 'CNY', symbol: '¥', exponent: 2 },
  KRW: { code: 'KRW', symbol: '₩', exponent: 0 },
  INR: { code: 'INR', symbol: '₹', exponent: 2 },
  SGD: { code: 'SGD', symbol: '$', exponent: 2 },
  HKD: { code: 'HKD', symbol: '$', exponent: 2 },

  // Africa
  ZAR: { code: 'ZAR', symbol: 'R', exponent: 2 },
  EGP: { code: 'EGP', symbol: '£', exponent: 2 },
  NGN: { code: 'NGN', symbol: '₦', exponent: 2 },
  KES: { code: 'KES', symbol: 'KSh', exponent: 2 },
  GHS: { code: 'GHS', symbol: '₵', exponent: 2 },
  MAD: { code: 'MAD', symbol: 'د.م.', exponent: 2 },
  TND: { code: 'TND', symbol: 'د.ت', exponent: 3 },
  DZD: { code: 'DZD', symbol: 'دج', exponent: 2 },
  XOF: { code: 'XOF', symbol: 'CFA', exponent: 0 },
  XAF: { code: 'XAF', symbol: 'FCFA', exponent: 0 },

  // Oceania
  AUD: { code: 'AUD', symbol: '$', exponent: 2 },
  NZD: { code: 'NZD', symbol: '$', exponent: 2 },

  // Middle East
  AED: { code: 'AED', symbol: 'د.إ', exponent: 2 },
  ILS: { code: 'ILS', symbol: '₪', exponent: 2 },
  SAR: { code: 'SAR', symbol: '﷼', exponent: 2 },
} as const;
