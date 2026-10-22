/**
 * Shared types for the Client Booking Manage portal components.
 */

import type { CancellationRefundPreview, ParsedEventDetails } from '@/lib/bookingStatusHelper';
import type { Booking, BookingQuote, BookingMessage, BookingAgreement, BookingReview } from '@repo/store';

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

export interface ClientContactInfo {
  name: string;
  email?: string;
  phone?: string;
}

export interface DjContactCardProps {
  contact: DjContactInfo;
  clientContact?: ClientContactInfo;
  viewerRole?: 'CLIENT' | 'DJ' | 'ADMIN';
}

/** Props shared by most manage-page sub-components. */
export interface ManageBookingContext {
  booking: Booking;
  currencyCode: string;
  totalAmount: number;
  formattedDate: string;
  displayTime: string;
  parsedDetails: ParsedEventDetails;
  djContact: DjContactInfo;
  isPaid: boolean;
  cancellationPreview: CancellationRefundPreview;
}

export interface BookingAccessModalProps {
  bookingId: string;
  defaultOrderReference?: string;
  isOpen: boolean;
  onSuccess: (token: string) => void;
  onClose?: () => void;
}

export interface DirectPaymentCardProps {
  booking: Booking;
  currencyCode: string;
  totalAmount: number;
  djStageName: string;
  formattedDate?: string;
  displayTime?: string;
  onPaymentReported?: () => void;
}

export interface QuoteNegotiationCardProps {
  booking: Booking;
  currencyCode: string;
  quotes: BookingQuote[];
  agreement?: BookingAgreement | null;
  viewerRole?: 'CLIENT' | 'DJ' | 'ADMIN';
  clientName?: string;
  clientEmail?: string;
  djStageName?: string;
  djEmail?: string;
  onQuoteUpdated?: () => void;
}

export interface BookingMessageThreadProps {
  bookingId: string;
  messages: BookingMessage[];
  clientName: string;
  clientEmail?: string;
  djStageName: string;
  djEmail?: string;
  viewerRole?: 'CLIENT' | 'DJ' | 'ADMIN';
  onMessageSent?: () => void;
}

export interface PostEventCardProps {
  booking: Booking;
  review?: BookingReview | null;
  onActionComplete?: () => void;
}
