/**
 * Canonical Booking Status Helper
 * Provides unified status normalization, badge configurations, and lifecycle checks.
 */

export type CanonicalBookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'AWAITING_PAYMENT'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'NO_SHOW'
  | 'DISPUTED';

export type DirectPaymentStatusType =
  | 'UNREPORTED'
  | 'CLIENT_REPORTED'
  | 'DJ_CONFIRMED';

export interface StatusBadgeConfig {
  label: string;
  badgeClass: string;
  dotClass: string;
  description: string;
}

/**
 * Normalizes any legacy or variant status string to the canonical uppercase status.
 */
export function normalizeBookingStatus(status?: string | null): CanonicalBookingStatus {
  if (!status) return 'PENDING';
  const clean = status.trim().toUpperCase();

  switch (clean) {
    case 'PENDING':
      return 'PENDING';
    case 'ACCEPTED':
      return 'ACCEPTED';
    case 'AWAITING_PAYMENT':
    case 'PAYMENT_PENDING':
    case 'WAITING_PAYMENT':
      return 'AWAITING_PAYMENT';
    case 'CONFIRMED':
    case 'PAID':
      return 'CONFIRMED';
    case 'IN_PROGRESS':
    case 'ACTIVE':
      return 'IN_PROGRESS';
    case 'COMPLETED':
      return 'COMPLETED';
    case 'CANCELLED':
    case 'CANCELED':
      return 'CANCELLED';
    case 'REJECTED':
    case 'DECLINED':
      return 'REJECTED';
    case 'EXPIRED':
      return 'EXPIRED';
    case 'NO_SHOW':
      return 'NO_SHOW';
    case 'DISPUTED':
      return 'DISPUTED';
    default:
      return 'PENDING';
  }
}

/**
 * Checks if a booking is considered "Upcoming" (Confirmed or Accepted with future event date).
 */
export function isBookingUpcoming(status?: string | null, eventDate?: string | Date | null): boolean {
  const normalized = normalizeBookingStatus(status);
  if (normalized !== 'CONFIRMED' && normalized !== 'ACCEPTED') return false;
  if (!eventDate) return true;
  return new Date(eventDate).getTime() > Date.now();
}

/**
 * Returns UI badge styling and human-readable metadata for any booking status.
 */
export function getBookingStatusBadge(
  status?: string | null,
  eventDate?: string | Date | null
): StatusBadgeConfig {
  const canonical = normalizeBookingStatus(status);

  switch (canonical) {
    case 'PENDING':
      return {
        label: 'New Request',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
        dotClass: 'bg-amber-500',
        description: 'New booking awaiting your review and quote acceptance',
      };

    case 'ACCEPTED':
      return {
        label: 'Accepted',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200/60',
        dotClass: 'bg-sky-500',
        description: 'Accepted by you. Finalizing quote negotiation and direct payment arrangements.',
      };

    case 'AWAITING_PAYMENT':
      return {
        label: 'Awaiting Agreement',
        badgeClass: 'bg-orange-50 text-orange-700 border-orange-200/60',
        dotClass: 'bg-orange-500',
        description: 'Quote proposed. Awaiting client review and direct payment.',
      };

    case 'CONFIRMED': {
      const upcoming = isBookingUpcoming(canonical, eventDate);
      return {
        label: upcoming ? 'Confirmed (Upcoming)' : 'Confirmed',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        dotClass: 'bg-emerald-500',
        description: 'Direct payment confirmed by you. The date is locked on your schedule.',
      };
    }

    case 'IN_PROGRESS':
      return {
        label: 'Gig In Progress',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/60',
        dotClass: 'bg-purple-500 animate-pulse',
        description: 'Event is taking place today.',
      };

    case 'COMPLETED':
      return {
        label: 'Completed',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/60',
        dotClass: 'bg-blue-500',
        description: 'Gig completed successfully. Client review recorded.',
      };

    case 'CANCELLED':
      return {
        label: 'Cancelled',
        badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
        dotClass: 'bg-gray-400',
        description: 'Booking was cancelled.',
      };

    case 'REJECTED':
      return {
        label: 'Declined',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/60',
        dotClass: 'bg-rose-500',
        description: 'You declined this booking request.',
      };

    case 'DISPUTED':
      return {
        label: 'Issue Reported',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/60',
        dotClass: 'bg-rose-500',
        description: 'A client issue or dispute has been reported.',
      };

    default:
      return {
        label: canonical,
        badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
        dotClass: 'bg-gray-400',
        description: 'Booking status: ' + canonical,
      };
  }
}

/**
 * Returns client-facing UI badge styling and friendly copy for booking manage portal.
 */
export function getClientBookingStatusBadge(
  status?: string | null,
  eventDate?: string | Date | null
): StatusBadgeConfig {
  const canonical = normalizeBookingStatus(status);

  switch (canonical) {
    case 'PENDING':
      return {
        label: 'Under Artist Review',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
        dotClass: 'bg-amber-500',
        description: 'Your booking request is being reviewed by the artist. You will receive an email once accepted with the proposed quotation.',
      };

    case 'ACCEPTED':
      return {
        label: 'Booking Accepted',
        badgeClass: 'bg-sky-50 text-sky-800 border-sky-200/80',
        dotClass: 'bg-sky-500',
        description: 'The artist has accepted your booking. Review the quote and event details.',
      };

    case 'AWAITING_PAYMENT':
      return {
        label: 'Quotation Ready',
        badgeClass: 'bg-orange-50 text-orange-800 border-orange-200/80',
        dotClass: 'bg-orange-500',
        description: 'The artist has prepared a quotation. Review the agreed terms and event details.',
      };

    case 'CONFIRMED': {
      const upcoming = isBookingUpcoming(canonical, eventDate);
      return {
        label: upcoming ? 'Confirmed (Upcoming)' : 'Confirmed',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        dotClass: 'bg-emerald-500',
        description: 'Your booking is confirmed with the artist. Event terms and schedule are finalized.',
      };
    }

    case 'IN_PROGRESS':
      return {
        label: 'Gig In Progress Today',
        badgeClass: 'bg-purple-50 text-purple-800 border-purple-200/80',
        dotClass: 'bg-purple-500 animate-pulse',
        description: 'Your event performance is scheduled for today. Have a fantastic time!',
      };

    case 'COMPLETED':
      return {
        label: 'Event Completed',
        badgeClass: 'bg-blue-50 text-blue-800 border-blue-200/80',
        dotClass: 'bg-blue-500',
        description: 'This booking has successfully concluded. Leave a review below!',
      };

    case 'CANCELLED':
      return {
        label: 'Booking Cancelled',
        badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
        dotClass: 'bg-gray-400',
        description: 'This booking has been cancelled.',
      };

    case 'REJECTED':
      return {
        label: 'Declined by Artist',
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200/80',
        dotClass: 'bg-rose-500',
        description: 'The artist was unavailable for this date and was unable to accept this booking request.',
      };

    case 'DISPUTED':
      return {
        label: 'Issue Reported',
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200/80',
        dotClass: 'bg-rose-500',
        description: 'An issue has been flagged for this booking. The artist has been notified.',
      };

    case 'EXPIRED':
      return {
        label: 'Expired',
        badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
        dotClass: 'bg-stone-400',
        description: 'This booking request is no longer active.',
      };

    default:
      return {
        label: canonical,
        badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
        dotClass: 'bg-gray-400',
        description: 'Booking status: ' + canonical,
      };
  }
}

/**
 * Direct Payment Status Badge Config (Informational Only - never gateway verified)
 */
export function getDirectPaymentStatusBadge(
  status?: DirectPaymentStatusType | string | null
): StatusBadgeConfig {
  switch (status) {
    case 'CLIENT_REPORTED':
      return {
        label: 'Payment Reported by Client',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        dotClass: 'bg-amber-500',
        description: 'Client reported sending direct payment. Awaiting DJ confirmation.',
      };
    case 'DJ_CONFIRMED':
      return {
        label: 'Direct Payment Confirmed',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotClass: 'bg-emerald-500',
        description: 'DJ confirmed direct payment received outside UpBeat Africa.',
      };
    case 'UNREPORTED':
    default:
      return {
        label: 'Direct Arrangement',
        badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
        dotClass: 'bg-gray-400',
        description: 'Payment terms and settlement are handled directly between client and artist.',
      };
  }
}

export interface ParsedEventDetails {
  startTime: string;
  duration: string;
  requirements: string;
  otherDetails: string[];
  cancelledBy?: string;
  cancellationReason?: string;
  refundPercent?: number;
  refundAmount?: number;
  refundStatus?: string;
}

/**
 * Safely parses eventDetails whether it is a string, an object/JSON, or undefined.
 */
export function parseBookingEventDetails(eventDetails?: unknown): ParsedEventDetails {
  const result: ParsedEventDetails = {
    startTime: '',
    duration: '',
    requirements: '',
    otherDetails: [],
  };

  if (!eventDetails) return result;

  // Case 1: eventDetails is already an object
  if (typeof eventDetails === 'object' && eventDetails !== null) {
    const details = eventDetails as Record<string, unknown>;
    if (details.startTime) result.startTime = String(details.startTime).trim();
    else if (details.time) result.startTime = String(details.time).trim();

    if (details.duration) result.duration = String(details.duration).trim();
    if (details.requirements) result.requirements = String(details.requirements).trim();

    if (details.cancelledBy) result.cancelledBy = String(details.cancelledBy);
    if (details.cancellationReason) result.cancellationReason = String(details.cancellationReason);
    if (details.refundPercent !== undefined) result.refundPercent = Number(details.refundPercent);
    if (details.refundAmount !== undefined) result.refundAmount = Number(details.refundAmount);
    if (details.refundStatus) result.refundStatus = String(details.refundStatus);

    if (details.notes) result.otherDetails.push(String(details.notes).trim());
    return result;
  }

  // Case 2: eventDetails is a string (or JSON string)
  if (typeof eventDetails === 'string') {
    const trimmed = eventDetails.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        return parseBookingEventDetails(parsed);
      } catch {
        // Continue to line parsing below
      }
    }

    const lines = trimmed.split('\n');
    lines.forEach((line) => {
      const cleanLine = line.trim();
      if (cleanLine.startsWith('Start Time:')) {
        result.startTime = cleanLine.replace('Start Time:', '').trim();
      } else if (cleanLine.startsWith('Duration:')) {
        result.duration = cleanLine.replace('Duration:', '').trim();
      } else if (cleanLine.startsWith('Requirements:')) {
        result.requirements = cleanLine.replace('Requirements:', '').trim();
      } else if (cleanLine) {
        result.otherDetails.push(cleanLine);
      }
    });
  }

  return result;
}

export interface CancellationRefundPreview {
  hoursUntilEvent: number | null;
  daysUntilEvent: number | null;
  formattedRemainingTime: string;
  isPaid: boolean;
  refundPercent: number;
  refundAmount: number;
  artistRetentionAmount: number;
  policyTier: 'FULL_REFUND' | 'PARTIAL_REFUND' | 'NO_REFUND' | 'FREE_CANCELLATION';
  tierLabel: string;
  tierDescription: string;
  badgeClass: string;
}

export function calculateCancellationPreview(
  eventDate?: string | Date | null,
  totalAmount: number = 0,
  isPaid: boolean = false
): CancellationRefundPreview {
  if (!isPaid) {
    return {
      hoursUntilEvent: null,
      daysUntilEvent: null,
      formattedRemainingTime: 'Unpaid Booking',
      isPaid: false,
      refundPercent: 0,
      refundAmount: 0,
      artistRetentionAmount: 0,
      policyTier: 'FREE_CANCELLATION',
      tierLabel: 'Free Cancellation (Unpaid)',
      tierDescription: 'This booking has not been paid yet. Cancelling now is free and will immediately release the reserved date with no charges.',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    };
  }

  if (!eventDate) {
    return {
      hoursUntilEvent: null,
      daysUntilEvent: null,
      formattedRemainingTime: 'Date not set',
      isPaid: true,
      refundPercent: 100,
      refundAmount: totalAmount,
      artistRetentionAmount: 0,
      policyTier: 'FULL_REFUND',
      tierLabel: '100% Full Refund',
      tierDescription: 'Event date is not set. 100% of your payment will be refunded to your original payment method.',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    };
  }

  const eventTime = new Date(eventDate).getTime();
  const now = Date.now();
  const diffMs = eventTime - now;
  const hoursUntilEvent = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  const daysUntilEvent = Math.floor(hoursUntilEvent / 24);
  const remHours = hoursUntilEvent % 24;

  const formattedRemainingTime =
    daysUntilEvent > 0
      ? `${daysUntilEvent} day${daysUntilEvent > 1 ? 's' : ''}${remHours > 0 ? ` ${remHours} hr${remHours > 1 ? 's' : ''}` : ''} remaining`
      : `${hoursUntilEvent} hour${hoursUntilEvent > 1 ? 's' : ''} remaining`;

  if (hoursUntilEvent >= 72) {
    return {
      hoursUntilEvent,
      daysUntilEvent,
      formattedRemainingTime,
      isPaid: true,
      refundPercent: 100,
      refundAmount: totalAmount,
      artistRetentionAmount: 0,
      policyTier: 'FULL_REFUND',
      tierLabel: '100% Full Refund Eligible',
      tierDescription: `More than 72 hours remaining before event (${formattedRemainingTime}). You will receive a 100% full refund under the UpBeat Escrow Guarantee.`,
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    };
  } else if (hoursUntilEvent >= 24) {
    const refundAmount = Math.round((totalAmount * 0.5) * 100) / 100;
    const retention = Math.round((totalAmount - refundAmount) * 100) / 100;
    return {
      hoursUntilEvent,
      daysUntilEvent,
      formattedRemainingTime,
      isPaid: true,
      refundPercent: 50,
      refundAmount,
      artistRetentionAmount: retention,
      policyTier: 'PARTIAL_REFUND',
      tierLabel: '50% Partial Refund Eligible',
      tierDescription: `Between 24 and 72 hours remaining before event (${formattedRemainingTime}). 50% will be refunded to your original payment method, and 50% is retained to compensate the artist for reserving their calendar.`,
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    };
  } else {
    return {
      hoursUntilEvent,
      daysUntilEvent,
      formattedRemainingTime,
      isPaid: true,
      refundPercent: 0,
      refundAmount: 0,
      artistRetentionAmount: totalAmount,
      policyTier: 'NO_REFUND',
      tierLabel: 'Non-Refundable (0% Refund)',
      tierDescription: `Less than 24 hours remaining before event (${formattedRemainingTime}). Due to late notice, 100% of the booking fee is retained to compensate the artist for late cancellation.`,
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    };
  }
}
