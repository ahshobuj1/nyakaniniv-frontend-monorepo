import React from 'react';

export interface MoneyDisplayProps {
  amount: number | string | null | undefined;
  currencyCode?: string | null;
  locale?: string;
  className?: string;
}

const ZERO_DECIMAL_CURRENCIES = new Set(['UGX', 'RWF', 'TZS', 'BIF', 'GNF', 'XOF', 'XAF', 'KMF']);

const CURRENCY_LOCALES: Record<string, string> = {
  KES: 'en-KE',
  NGN: 'en-NG',
  GHS: 'en-GH',
  ZAR: 'en-ZA',
  UGX: 'en-UG',
  TZS: 'en-TZ',
  RWF: 'en-RW',
  USD: 'en-US',
};

export function formatMoney(amount: number | string | null | undefined, currencyCode?: string | null): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '—';
  }

  const numeric = Number(amount);
  const code = (currencyCode || 'KES').toUpperCase();
  const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.has(code);
  const locale = CURRENCY_LOCALES[code] || 'en-KE';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: isZeroDecimal ? 0 : 2,
      maximumFractionDigits: isZeroDecimal ? 0 : 2,
    }).format(numeric);
  } catch {
    // Fallback if custom currency code fails Intl formatting
    return `${code} ${numeric.toLocaleString(undefined, {
      minimumFractionDigits: isZeroDecimal ? 0 : 2,
      maximumFractionDigits: isZeroDecimal ? 0 : 2,
    })}`;
  }
}

export function MoneyDisplay({ amount, currencyCode, className }: MoneyDisplayProps) {
  const formatted = formatMoney(amount, currencyCode);

  return (
    <span className={className || 'font-semibold tracking-tight'}>
      {formatted}
    </span>
  );
}

export default MoneyDisplay;
