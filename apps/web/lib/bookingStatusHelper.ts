/**
 * Canonical Booking Status Helper
 * Provides unified status normalization, badge configurations, and lifecycle checks.
 */

export type CanonicalBookingStatus =
  | 'PENDING'
  | 'AWAITING_PAYMENT'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'NO_SHOW'
  | 'DISPUTED';

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
    case 'AWAITING_PAYMENT':
    case 'PAYMENT_PENDING':
    case 'WAITING_PAYMENT':
      return 'AWAITING_PAYMENT';
    case 'ACCEPTED':
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
 * Checks if a booking is considered "Upcoming" (Confirmed with future event date).
 */
export function isBookingUpcoming(status?: string | null, eventDate?: string | Date | null): boolean {
  const normalized = normalizeBookingStatus(status);
  if (normalized !== 'CONFIRMED') return false;
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
        description: 'New booking awaiting your review and approval',
      };

    case 'AWAITING_PAYMENT':
      return {
        label: 'Awaiting Payment',
        badgeClass: 'bg-orange-50 text-orange-700 border-orange-200/60',
        dotClass: 'bg-orange-500 animate-pulse',
        description: 'Approved by you. Client has received the payment link and must pay to lock the date.',
      };

    case 'CONFIRMED': {
      const upcoming = isBookingUpcoming(canonical, eventDate);
      return {
        label: upcoming ? 'Confirmed (Upcoming)' : 'Confirmed',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        dotClass: 'bg-emerald-500',
        description: 'Payment secured in escrow or cash confirmed. The date is officially booked.',
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
        description: 'Gig completed successfully. Escrow funds have been released into your wallet.',
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
        description: 'Your booking request is being reviewed by the artist. You will receive an email once accepted with your quotation.',
      };

    case 'AWAITING_PAYMENT':
      return {
        label: 'Accepted • Payment Required',
        badgeClass: 'bg-orange-50 text-orange-800 border-orange-200/80',
        dotClass: 'bg-orange-500 animate-pulse',
        description: 'Great news! The artist has accepted your request. Please complete payment to officially lock in your date.',
      };

    case 'CONFIRMED': {
      const upcoming = isBookingUpcoming(canonical, eventDate);
      return {
        label: upcoming ? 'Confirmed (Upcoming)' : 'Confirmed & Secured',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        dotClass: 'bg-emerald-500',
        description: 'Your booking is locked! Payment is held safely in UpBeat Escrow and will only be released after the event ends.',
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
        description: 'This booking has successfully concluded. Thank you for booking through UpBeat Africa!',
      };

    case 'CANCELLED':
      return {
        label: 'Booking Cancelled',
        badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
        dotClass: 'bg-gray-400',
        description: 'This booking has been cancelled. Any refund due under our Escrow policy is handled automatically.',
      };

    case 'REJECTED':
      return {
        label: 'Declined by Artist',
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200/80',
        dotClass: 'bg-rose-500',
        description: 'The artist was unavailable for this date and was unable to accept this booking request.',
      };

    case 'EXPIRED':
      return {
        label: 'Payment Window Expired',
        badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
        dotClass: 'bg-stone-400',
        description: 'The 48-hour payment window for this quote has elapsed. Please submit a new booking request.',
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
