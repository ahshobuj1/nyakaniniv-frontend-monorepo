'use client';

import Link from 'next/link';
import { Button } from '@repo/ui';
import { DownloadIcon, ArrowLeft } from 'lucide-react';
import { Booking } from '@repo/store';

import { getBookingStatusBadge } from '@/lib/bookingStatusHelper';

interface BookingHeaderProps {
  booking: Booking;
  downloading: boolean;
  onDownloadInvoice: (invoiceId: string) => void;
}

export function BookingHeader({
  booking,
  downloading,
  onDownloadInvoice,
}: BookingHeaderProps) {
  const badgeConfig = getBookingStatusBadge(booking.status, booking.eventDate);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/bookings">
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-[#111827]">Booking Details</h1>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${badgeConfig.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${badgeConfig.dotClass}`} />
              {badgeConfig.label}
            </span>
          </div>
          <p className="text-sm text-[#6B7280] mt-1 font-mono">{booking.id}</p>
        </div>
      </div>

      {booking.invoice?.id && (
        <Button
          onClick={() => onDownloadInvoice(booking.invoice!.id)}
          disabled={downloading}
          className="bg-[#111827] hover:bg-gray-800 text-white rounded-lg shadow-sm"
        >
          {downloading ? (
            'Downloading...'
          ) : (
            <>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download PDF Receipt
            </>
          )}
        </Button>
      )}
    </div>
  );
}
