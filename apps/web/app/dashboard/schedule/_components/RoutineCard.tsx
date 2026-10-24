'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {Card, CardContent, Button} from '@repo/ui';
import {BookingStatusBadge} from '@/components/BookingStatusBadge';
import {
  getDirectPaymentStatusBadge,
  normalizeBookingStatus,
  isEventInFuture,
} from '@/lib/bookingStatusHelper';
import {formatDateInTz, formatTimeInTz} from '@/lib/timezone';
import {RoutineCardProps} from './types';

export function RoutineCard({
  booking,
  djTimezone,
  isToday,
  onOpenCompleteModal,
  onOpenPaymentModal,
}: RoutineCardProps) {
  const status = normalizeBookingStatus(booking.status);
  const isCompleted = status === 'COMPLETED';
  const isFuture = isEventInFuture(booking.eventDate);

  const directPaymentStatus = booking.directPaymentStatus || 'UNREPORTED';
  const directBadge = getDirectPaymentStatusBadge(directPaymentStatus);

  const eventDetails =
    typeof booking.eventDetails === 'object' && booking.eventDetails !== null
      ? (booking.eventDetails as Record<string, unknown>)
      : {};
  const directReport = eventDetails.directPaymentReport as
    | {
        method?: string;
        reference?: string;
        notes?: string;
        reportedAt?: string;
      }
    | undefined;

  const eventDateDisplay = booking.eventDate
    ? formatDateInTz(booking.eventDate, djTimezone, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date TBD';
  const eventTimeDisplay = booking.eventDate
    ? formatTimeInTz(booking.eventDate, djTimezone)
    : 'Time TBD';

  const feeAmount = Number(booking.totalAmount || 0);
  const currency = booking.currencyCode || 'KES';

  return (
    <Card
      className={`p-0 border border-gray-200 shadow-sm overflow-hidden flex flex-col rounded-2xl bg-white transition-all hover:shadow-md relative ${
        isToday ? 'ring-2 ring-primary/80' : ''
      }`}>
      {/* Top Banner for Today's Active Gig */}
      {isToday && (
        <div className="bg-[#FFF8E6] border-b border-[#FDE68A] px-5 py-2 text-[#D97706] text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Today&apos;s Active Performance
          </span>
          <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-sm border border-[#FDE68A]">
            Event Time: {eventTimeDisplay}
          </span>
        </div>
      )}

      {/* Top Right Status Badge */}
      <div className={`absolute ${isToday ? 'top-12' : 'top-4'} right-4 z-10`}>
        <BookingStatusBadge status={booking.status} size="sm" />
      </div>

      <CardContent className="pt-5 px-5 pb-5 flex flex-col grow space-y-4">
        {/* Title & Client */}
        <div>
          <h3 className="text-[17px] font-bold text-[#111620] mb-1 line-clamp-1 pr-24">
            {booking.eventType || 'DJ Gig Performance'}
          </h3>
          <p className="text-[13px] text-[#787878]">
            Client:{' '}
            <span className="text-[#111620] font-semibold">
              {booking.client?.name || 'Client'}
            </span>
          </p>
        </div>

        {/* Date, Time, Venue & Contact (matching EventCard) */}
        <div className="space-y-2 text-[#787878] text-[13px] bg-gray-50/60 p-3.5 rounded-xl border border-gray-100">
          <div className="flex items-center text-[#787878] text-[13px] gap-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400 stroke-[1.5]" />
              {eventDateDisplay}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-gray-400 stroke-[1.5]" />
              {eventTimeDisplay}
            </div>
          </div>

          <div className="flex items-center text-[#787878] text-[13px]">
            <MapPin className="w-4 h-4 mr-2 text-primary stroke-[1.5] shrink-0" />
            <span className="line-clamp-1">
              {booking.address || 'Venue address pending client confirmation'}
            </span>
          </div>

          {(booking.client?.phone || booking.client?.email) && (
            <div className="flex items-center gap-4 pt-1 border-t border-gray-100 text-xs">
              {booking.client?.phone && (
                <a
                  href={`tel:${booking.client.phone}`}
                  className="flex items-center text-[#10B981] font-semibold hover:underline">
                  <Phone className="w-3.5 h-3.5 mr-1" />
                  {booking.client.phone}
                </a>
              )}
              {booking.client?.email && (
                <a
                  href={`mailto:${booking.client.email}`}
                  className="flex items-center text-gray-500 hover:text-gray-800"
                  title={booking.client.email}>
                  <Mail className="w-3.5 h-3.5 mr-1" />
                  <span className="truncate max-w-[150px]">
                    {booking.client.email}
                  </span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Fee & Payment Status */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-[11px] text-[#A1A1AA] uppercase tracking-wider font-semibold block">
                Performance Fee
              </span>
              <span className="text-[16px] font-bold text-[#111620]">
                {feeAmount > 0
                  ? `${currency} ${feeAmount.toLocaleString()}`
                  : 'Quote Pending'}
              </span>
            </div>

            <span
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-[6px] border ${directBadge.badgeClass}`}>
              {directBadge.label}
            </span>
          </div>

          {/* Client Direct Payment Reported Alert Banner */}
          {directPaymentStatus === 'CLIENT_REPORTED' && onOpenPaymentModal && (
            <div className="bg-[#FFF8E6] border border-[#FDE68A] rounded-lg p-2.5 flex items-center justify-between text-xs text-[#D97706]">
              <span>
                Client reported ref:{' '}
                <strong className="font-mono">
                  {directReport?.reference || 'Direct'}
                </strong>
              </span>
              <button
                type="button"
                onClick={() => onOpenPaymentModal(booking)}
                className="font-bold underline hover:text-[#B45309] cursor-pointer">
                Verify Payment &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100 mt-auto">
          <div>
            {!isFuture && !isCompleted && onOpenCompleteModal ? (
              <Button
                size="sm"
                onClick={() => onOpenCompleteModal(booking)}
                className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 px-4 rounded-lg shadow-sm cursor-pointer transition-all active:scale-[0.98]">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Mark Gig Completed
              </Button>
            ) : isCompleted ? (
              <span className="text-xs font-bold text-blue-600 inline-flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </span>
            ) : (
              <span className="text-xs text-[#A1A1AA] font-medium inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Upcoming on calendar
              </span>
            )}
          </div>

          <Link
            href={`/dashboard/bookings/${booking.id}`}
            className="text-primary text-[13px] font-bold flex items-center hover:underline ml-auto">
            Manage Booking <ArrowRight className="w-4 h-4 ml-1 stroke-[2.5]" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
