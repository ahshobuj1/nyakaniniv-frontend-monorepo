/**
 * Shared types for the Client Booking Manage portal components.
 */

import type { CancellationRefundPreview, ParsedEventDetails } from '@/lib/bookingStatusHelper';

/** Shape of DJ contact info extracted in the parent page. */
export interface DjContactInfo {
  stageName: string;
  email?: string;
  phone?: string;
  cleanPhone: string;
  whatsapp?: string;
  cleanWhatsapp: string;
  websiteUrl?: string;
}

/** Props shared by most manage-page sub-components. */
export interface ManageBookingContext {
  booking: Record<string, any>;
  currencyCode: string;
  totalAmount: number;
  formattedDate: string;
  displayTime: string;
  parsedDetails: ParsedEventDetails;
  djContact: DjContactInfo;
  isPaid: boolean;
  cancellationPreview: CancellationRefundPreview;
}
