export type InvoiceFilterType = 'All' | 'Paid' | 'Unpaid';

export interface InvoicePaymentInfo {
  isPaid: boolean;
  gateway: string | null;
  method: string | null;
  gatewayLabel: string;
  methodLabel: string;
  combinedLabel: string;
  cardBrand: string | null;
  cardLast4: string | null;
  paidAt: string | null;
}
