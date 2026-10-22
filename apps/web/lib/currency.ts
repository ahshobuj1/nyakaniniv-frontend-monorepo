export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  group: 'East Africa' | 'West Africa' | 'Southern Africa' | 'Central Africa' | 'North Africa' | 'Global';
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  // East Africa
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', group: 'East Africa' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', group: 'East Africa' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', group: 'East Africa' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF', group: 'East Africa' },
  { code: 'BIF', name: 'Burundian Franc', symbol: 'FBu', group: 'East Africa' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', group: 'East Africa' },
  { code: 'SSP', name: 'South Sudanese Pound', symbol: 'SSP', group: 'East Africa' },
  { code: 'SOS', name: 'Somali Shilling', symbol: 'So.Sh', group: 'East Africa' },
  { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj', group: 'East Africa' },
  { code: 'ERN', name: 'Eritrean Nakfa', symbol: 'Nkf', group: 'East Africa' },

  // West Africa
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', group: 'West Africa' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', group: 'West Africa' },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', group: 'West Africa' },
  { code: 'GNF', name: 'Guinean Franc', symbol: 'FG', group: 'West Africa' },
  { code: 'SLE', name: 'Sierra Leonean Leone', symbol: 'Le', group: 'West Africa' },
  { code: 'LRD', name: 'Liberian Dollar', symbol: 'L$', group: 'West Africa' },
  { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D', group: 'West Africa' },
  { code: 'CVE', name: 'Cape Verdean Escudo', symbol: 'Esc', group: 'West Africa' },
  { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'UM', group: 'West Africa' },

  // Southern Africa
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', group: 'Southern Africa' },
  { code: 'BWP', name: 'Botswana Pula', symbol: 'P', group: 'Southern Africa' },
  { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$', group: 'Southern Africa' },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', group: 'Southern Africa' },
  { code: 'ZWL', name: 'Zimbabwean Dollar', symbol: 'Z$', group: 'Southern Africa' },
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK', group: 'Southern Africa' },
  { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT', group: 'Southern Africa' },
  { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz', group: 'Southern Africa' },
  { code: 'LSL', name: 'Lesotho Loti', symbol: 'L', group: 'Southern Africa' },
  { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'E', group: 'Southern Africa' },
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar', group: 'Southern Africa' },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨', group: 'Southern Africa' },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: 'SR', group: 'Southern Africa' },
  { code: 'KMF', name: 'Comorian Franc', symbol: 'CF', group: 'Southern Africa' },

  // Central Africa
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', group: 'Central Africa' },
  { code: 'CDF', name: 'Congolese Franc', symbol: 'FC', group: 'Central Africa' },
  { code: 'STN', name: 'São Tomé Dobra', symbol: 'Db', group: 'Central Africa' },

  // North Africa
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', group: 'North Africa' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'DH', group: 'North Africa' },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'DA', group: 'North Africa' },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'DT', group: 'North Africa' },
  { code: 'LYD', name: 'Libyan Dinar', symbol: 'LD', group: 'North Africa' },
  { code: 'SDG', name: 'Sudanese Pound', symbol: 'SDG', group: 'North Africa' },

  // Global Currencies
  { code: 'USD', name: 'US Dollar', symbol: '$', group: 'Global' },
  { code: 'GBP', name: 'British Pound', symbol: '£', group: 'Global' },
  { code: 'EUR', name: 'Euro', symbol: '€', group: 'Global' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', group: 'Global' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', group: 'Global' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', group: 'Global' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', group: 'Global' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QAR', group: 'Global' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', group: 'Global' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', group: 'Global' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', group: 'Global' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', group: 'Global' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'PKR', group: 'Global' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', group: 'Global' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', group: 'Global' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', group: 'Global' },
];

export const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  // East Africa
  KE: 'KES', KENYA: 'KES',
  UG: 'UGX', UGANDA: 'UGX',
  TZ: 'TZS', TANZANIA: 'TZS',
  RW: 'RWF', RWANDA: 'RWF',
  BI: 'BIF', BURUNDI: 'BIF',
  ET: 'ETB', ETHIOPIA: 'ETB',
  SS: 'SSP', 'SOUTH SUDAN': 'SSP',
  SO: 'SOS', SOMALIA: 'SOS',
  DJ: 'DJF', DJIBOUTI: 'DJF',
  ER: 'ERN', ERITREA: 'ERN',

  // West Africa
  NG: 'NGN', NIGERIA: 'NGN',
  GH: 'GHS', GHANA: 'GHS',
  SN: 'XOF', SENEGAL: 'XOF',
  CI: 'XOF', "COTE D'IVOIRE": 'XOF', 'IVORY COAST': 'XOF',
  BF: 'XOF', 'BURKINA FASO': 'XOF',
  ML: 'XOF', MALI: 'XOF',
  BJ: 'XOF', BENIN: 'XOF',
  TG: 'XOF', TOGO: 'XOF',
  NE: 'XOF', NIGER: 'XOF',
  GW: 'XOF', 'GUINEA-BISSAU': 'XOF',
  GN: 'GNF', GUINEA: 'GNF',
  SL: 'SLE', 'SIERRA LEONE': 'SLE',
  LR: 'LRD', LIBERIA: 'LRD',
  GM: 'GMD', GAMBIA: 'GMD', 'THE GAMBIA': 'GMD',
  CV: 'CVE', 'CAPE VERDE': 'CVE', 'CABO VERDE': 'CVE',
  MR: 'MRU', MAURITANIA: 'MRU',

  // Southern Africa
  ZA: 'ZAR', 'SOUTH AFRICA': 'ZAR',
  BW: 'BWP', BOTSWANA: 'BWP',
  NA: 'NAD', NAMIBIA: 'NAD',
  ZM: 'ZMW', ZAMBIA: 'ZMW',
  ZW: 'ZWL', ZIMBABWE: 'ZWL',
  MW: 'MWK', MALAWI: 'MWK',
  MZ: 'MZN', MOZAMBIQUE: 'MZN',
  AO: 'AOA', ANGOLA: 'AOA',
  LS: 'LSL', LESOTHO: 'LSL',
  SZ: 'SZL', ESWATINI: 'SZL', SWAZILAND: 'SZL',
  MG: 'MGA', MADAGASCAR: 'MGA',
  MU: 'MUR', MAURITIUS: 'MUR',
  SC: 'SCR', SEYCHELLES: 'SCR',
  KM: 'KMF', COMOROS: 'KMF',

  // Central Africa
  CM: 'XAF', CAMEROON: 'XAF',
  GA: 'XAF', GABON: 'XAF',
  CG: 'XAF', CONGO: 'XAF', 'REPUBLIC OF THE CONGO': 'XAF',
  CD: 'CDF', 'DEMOCRATIC REPUBLIC OF THE CONGO': 'CDF', 'DR CONGO': 'CDF',
  TD: 'XAF', CHAD: 'XAF',
  CF: 'XAF', 'CENTRAL AFRICAN REPUBLIC': 'XAF',
  GQ: 'XAF', 'EQUATORIAL GUINEA': 'XAF',
  ST: 'STN', 'SAO TOME AND PRINCIPE': 'STN',

  // North Africa
  EG: 'EGP', EGYPT: 'EGP',
  MA: 'MAD', MOROCCO: 'MAD',
  DZ: 'DZD', ALGERIA: 'DZD',
  TN: 'TND', TUNISIA: 'TND',
  LY: 'LYD', LIBYA: 'LYD',
  SD: 'SDG', SUDAN: 'SDG',

  // Global
  US: 'USD', USA: 'USD', 'UNITED STATES': 'USD',
  GB: 'GBP', UK: 'GBP', 'UNITED KINGDOM': 'GBP',
  CA: 'CAD', CANADA: 'CAD',
  AU: 'AUD', AUSTRALIA: 'AUD',
  AE: 'AED', UAE: 'AED', 'UNITED ARAB EMIRATES': 'AED',
  SA: 'SAR', 'SAUDI ARABIA': 'SAR',
  QA: 'QAR', QATAR: 'QAR',
  CH: 'CHF', SWITZERLAND: 'CHF',
  JP: 'JPY', JAPAN: 'JPY',
  IN: 'INR', INDIA: 'INR',
  BD: 'BDT', BANGLADESH: 'BDT',
  PK: 'PKR', PAKISTAN: 'PKR',
  SG: 'SGD', SINGAPORE: 'SGD',
  BR: 'BRL', BRAZIL: 'BRL',
  CN: 'CNY', CHINA: 'CNY',

  // Europe (Eurozone)
  FR: 'EUR', FRANCE: 'EUR',
  DE: 'EUR', GERMANY: 'EUR',
  ES: 'EUR', SPAIN: 'EUR',
  IT: 'EUR', ITALY: 'EUR',
  NL: 'EUR', NETHERLANDS: 'EUR',
  BE: 'EUR', BELGIUM: 'EUR',
  AT: 'EUR', AUSTRIA: 'EUR',
  PT: 'EUR', PORTUGAL: 'EUR',
  IE: 'EUR', IRELAND: 'EUR',
  GR: 'EUR', GREECE: 'EUR',
  FI: 'EUR', FINLAND: 'EUR',
  EU: 'EUR', EUROPE: 'EUR',
};

/**
 * Automatically resolves the standard currency code from country name or 2-letter ISO code.
 * Falls back to 'KES' if country is unspecified.
 */
export function getCurrencyForCountry(country?: string | null): string {
  if (!country) return 'KES';
  const clean = country.trim().toUpperCase();
  return COUNTRY_CURRENCY_MAP[clean] || 'KES';
}

/**
 * Returns currency symbol for a currency code (e.g. 'KES' -> 'KSh', 'NGN' -> '₦')
 */
export function getCurrencySymbol(currencyCode?: string | null): string {
  if (!currencyCode) return 'KSh';
  const found = SUPPORTED_CURRENCIES.find(
    (c) => c.code.toUpperCase() === currencyCode.toUpperCase(),
  );
  return found?.symbol || currencyCode;
}
