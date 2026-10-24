import React from 'react';
import {CheckCircle2, Clock, XCircle, AlertCircle} from 'lucide-react';

export interface BookingStatusBadgeProps {
  status?: string | null;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function BookingStatusBadge({
  status,
  label,
  className = '',
  size = 'md',
}: BookingStatusBadgeProps) {
  const s = status?.trim().toUpperCase() || 'PENDING';
  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-1 text-[11px] rounded-sm gap-1 font-medium'
      : 'px-3 py-1.5 text-[12px] md:text-[13px] rounded-sm gap-1.5 font-medium';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  switch (s) {
    case 'COMPLETED':
      return (
        <span
          className={`inline-flex items-center bg-blue-600 text-white shadow-2xs whitespace-nowrap ${sizeClasses} ${className}`}>
          <CheckCircle2 className={`${iconSize} shrink-0`} />
          {label || 'Completed'}
        </span>
      );

    case 'CONFIRMED':
      return (
        <span
          className={`inline-flex items-center bg-emerald-600 text-white shadow-2xs whitespace-nowrap ${sizeClasses} ${className}`}>
          <CheckCircle2 className={`${iconSize} shrink-0`} />
          {label || 'Confirmed'}
        </span>
      );

    case 'ACCEPTED':
      return (
        <span
          className={`inline-flex items-center bg-sky-500 text-white shadow-2xs whitespace-nowrap ${sizeClasses} ${className}`}>
          <Clock className={`${iconSize} shrink-0`} />
          {label || 'Quote Sent'}
        </span>
      );

    case 'AWAITING_PAYMENT':
      return (
        <span
          className={`inline-flex items-center bg-sky-500 text-white shadow-2xs whitespace-nowrap ${sizeClasses} ${className}`}>
          <Clock className={`${iconSize} shrink-0`} />
          {label || 'Awaiting Agreement'}
        </span>
      );

    case 'IN_PROGRESS':
      return (
        <span
          className={`inline-flex items-center bg-purple-600 text-white shadow-2xs whitespace-nowrap ${sizeClasses} ${className}`}>
          <Clock className={`${iconSize} shrink-0 animate-pulse`} />
          {label || 'Gig In Progress'}
        </span>
      );

    case 'CANCELLED':
    case 'CANCELED':
      return (
        <span
          className={`inline-flex items-center bg-red-500 text-white shadow-2xs whitespace-nowrap ${sizeClasses} ${className}`}>
          <XCircle className={`${iconSize} shrink-0`} />
          {label || 'Cancelled'}
        </span>
      );

    case 'REJECTED':
      return (
        <span
          className={`inline-flex items-center bg-red-500 text-white shadow-2xs whitespace-nowrap ${sizeClasses} ${className}`}>
          <XCircle className={`${iconSize} shrink-0`} />
          {label || 'Declined'}
        </span>
      );

    case 'DISPUTED':
      return (
        <span
          className={`inline-flex items-center bg-rose-600 text-white shadow-2xs whitespace-nowrap ${sizeClasses} ${className}`}>
          <AlertCircle className={`${iconSize} shrink-0`} />
          {label || 'Issue Reported'}
        </span>
      );

    case 'EXPIRED':
      return (
        <span
          className={`inline-flex items-center bg-gray-500 text-white shadow-2xs whitespace-nowrap ${sizeClasses} ${className}`}>
          <Clock className={`${iconSize} shrink-0`} />
          {label || 'Expired'}
        </span>
      );

    case 'NO_SHOW':
      return (
        <span
          className={`inline-flex items-center bg-gray-600 text-white shadow-2xs whitespace-nowrap ${sizeClasses} ${className}`}>
          <XCircle className={`${iconSize} shrink-0`} />
          {label || 'No Show'}
        </span>
      );

    case 'PENDING':
    default:
      return (
        <span
          className={`inline-flex items-center bg-[#F59E0B] text-white shadow-2xs whitespace-nowrap ${sizeClasses} ${className}`}>
          <Clock className={`${iconSize} shrink-0`} />
          {label || 'New Request'}
        </span>
      );
  }
}

export default BookingStatusBadge;
