'use client';

import Link from 'next/link';
import {Button} from '@repo/ui';
import {DownloadIcon, ArrowLeft} from 'lucide-react';
import {Booking} from '@repo/store';

import {getBookingStatusBadge} from '@/lib/bookingStatusHelper';

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
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Button>
        </Link>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-[#111827]">
              {booking.eventType || 'Event Performance'} with{' '}
              {booking.client?.name || 'Client'}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${badgeConfig.badgeClass}`}>
              <span
                className={`w-1.5 h-1.5 rounded-full ${badgeConfig.dotClass}`}
              />
              {badgeConfig.label}
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-1 font-mono">
            Ref:{' '}
            <strong className="text-gray-900">
              {booking.orderReference ||
                `UB-${booking.id.slice(0, 8).toUpperCase()}`}
            </strong>
            {booking.client?.email && (
              <>
                <span className="mx-1.5 text-gray-300">•</span>
                <span>{booking.client.email}</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/booking/manage/${booking.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary/80 border border-primary text-white hover:text-white rounded-sm text-xs font-semibold shadow-xs transition-colors ">
          <span>Client Portal Preview</span>
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </Link>

        {booking.invoice?.id && (
          <Button
            onClick={() => onDownloadInvoice(booking.invoice!.id)}
            disabled={downloading}
            className="bg-[#111827] hover:bg-gray-800 text-white rounded-lg shadow-sm">
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
    </div>
  );
}
