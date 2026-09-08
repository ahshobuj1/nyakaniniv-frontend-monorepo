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

export interface ParsedEventDetails {
  startTime: string;
  duration: string;
  requirements: string;
  otherDetails: string[];
}

/**
 * Safely parses eventDetails whether it is a string, an object/JSON, or undefined.
 */
export function parseBookingEventDetails(eventDetails?: any): ParsedEventDetails {
  const result: ParsedEventDetails = {
    startTime: '',
    duration: '',
    requirements: '',
    otherDetails: [],
  };

  if (!eventDetails) return result;

  // Case 1: eventDetails is already an object
  if (typeof eventDetails === 'object' && eventDetails !== null) {
    if (eventDetails.startTime) result.startTime = String(eventDetails.startTime).trim();
    else if (eventDetails.time) result.startTime = String(eventDetails.time).trim();

    if (eventDetails.duration) result.duration = String(eventDetails.duration).trim();
    if (eventDetails.requirements) result.requirements = String(eventDetails.requirements).trim();

    if (eventDetails.notes) result.otherDetails.push(String(eventDetails.notes).trim());
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
