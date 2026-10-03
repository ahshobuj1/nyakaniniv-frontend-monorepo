import { Invoice } from '@repo/store';
import { InvoicePaymentInfo } from '@/types/invoice.types';

/**
 * Maps raw gateway enum strings to user-friendly titles.
 */
export function formatGatewayName(gateway?: string | null): string {
  if (!gateway) return '';
  const clean = gateway.trim().toUpperCase();

  switch (clean) {
    case 'PAYSTACK':
      return 'Paystack';
    case 'PESAPAL':
      return 'Pesapal';
    case 'FLUTTERWAVE':
      return 'Flutterwave';
    case 'DPO':
      return 'DPO Group';
    case 'CELLULANT':
      return 'Cellulant';
    case 'CASH':
      return 'Cash';
    case 'MANUAL':
      return 'Direct Transfer / Manual';
    default:
      return clean.charAt(0) + clean.slice(1).toLowerCase().replace(/_/g, ' ');
  }
}

/**
 * Maps raw payment method/channel enum strings to user-friendly titles.
 */
export function formatMethodName(method?: string | null): string {
  if (!method) return '';
  const clean = method.trim().toUpperCase();

  switch (clean) {
    case 'CARD':
      return 'Card';
    case 'MOBILE_MONEY':
      return 'Mobile Money';
    case 'MPESA':
      return 'M-Pesa';
    case 'BANK_TRANSFER':
      return 'Bank Transfer';
    case 'USSD':
      return 'USSD';
    case 'CASH':
      return 'Cash';
    case 'UNKNOWN':
      return 'Online';
    default:
      return clean.charAt(0) + clean.slice(1).toLowerCase().replace(/_/g, ' ');
  }
}

/**
 * Extracts and formats payment gateway, method, and transaction metadata
 * safely for both table and detail view presentations.
 */
export function getInvoicePaymentInfo(invoice?: Partial<Invoice> | null): InvoicePaymentInfo {
  if (!invoice) {
    return {
      isPaid: false,
      gateway: null,
      method: null,
      gatewayLabel: 'Pending',
      methodLabel: 'Pending',
      combinedLabel: 'Pending Payment',
      cardBrand: null,
      cardLast4: null,
      paidAt: null,
    };
  }

  const isPaid = String(invoice.status || '').toUpperCase() === 'PAID';

  const rawGateway = invoice.gateway || null;
  const rawMethod = invoice.method || null;
  const cardBrand = invoice.cardBrand || null;
  const cardLast4 = invoice.cardLast4 || null;
  const paidAt = invoice.paidAt || (isPaid ? invoice.createdAt || null : null);

  // If unpaid, avoid showing "Card / Paystack" as if payment succeeded
  if (!isPaid) {
    const isCashArrangement = rawMethod === 'CASH' || rawGateway === 'CASH';
    return {
      isPaid: false,
      gateway: rawGateway,
      method: rawMethod,
      gatewayLabel: isCashArrangement ? 'Cash' : 'Pending',
      methodLabel: isCashArrangement ? 'Cash on Arrival' : 'Pending',
      combinedLabel: isCashArrangement ? 'Cash on Arrival (Pending)' : 'Pending Payment',
      cardBrand: null,
      cardLast4: null,
      paidAt: null,
    };
  }

  const formattedGateway = formatGatewayName(rawGateway);
  let formattedMethod = formatMethodName(rawMethod);

  if (cardLast4) {
    const brandPrefix = cardBrand ? `${cardBrand} ` : '';
    formattedMethod = `${brandPrefix}•••• ${cardLast4}`;
  }

  // Determine combined label
  let combinedLabel = 'Paid Online';
  if (formattedGateway && formattedMethod) {
    if (formattedGateway.toLowerCase() === formattedMethod.toLowerCase()) {
      combinedLabel = formattedGateway;
    } else {
      combinedLabel = `${formattedGateway} · ${formattedMethod}`;
    }
  } else if (formattedGateway) {
    combinedLabel = formattedGateway;
  } else if (formattedMethod) {
    combinedLabel = formattedMethod;
  }

  return {
    isPaid: true,
    gateway: rawGateway,
    method: rawMethod,
    gatewayLabel: formattedGateway || 'Online',
    methodLabel: formattedMethod || 'Payment',
    combinedLabel,
    cardBrand,
    cardLast4,
    paidAt,
  };
}
