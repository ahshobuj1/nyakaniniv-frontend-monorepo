'use client';

import React from 'react';
import {Ban, ShieldAlert} from 'lucide-react';
import type {ManageBookingContext} from './types';

interface CancellationSettlementProps {
  booking: ManageBookingContext['booking'];
  parsedDetails: ManageBookingContext['parsedDetails'];
  currencyCode: string;
  totalAmount: number;
  isPaid: boolean;
  djStageName: string;
}

/**
 * Displays the cancellation banner when a booking is CANCELLED.
 * Shows direct booking resolution details, cancellation reason, and party attribution.
 */
export function CancellationSettlement({
  booking,
  parsedDetails,
  currencyCode,
  totalAmount,
  djStageName,
}: CancellationSettlementProps) {
  const cancelledByParty =
    parsedDetails.cancelledBy === 'CLIENT'
      ? 'Client'
      : parsedDetails.cancelledBy === 'DJ'
        ? `${djStageName} (Artist)`
        : 'System';

  return (
    <div className="p-5 rounded-sm bg-rose-50/70 border border-rose-200/90 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Ban className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Booking Cancelled
            </h2>
            <p className="text-xs text-gray-500">
              Cancelled by {cancelledByParty}
              {booking.cancelledAt &&
                ` on ${new Date(booking.cancelledAt).toLocaleDateString(
                  'en-US',
                  {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  },
                )}`}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-bold border bg-white border-rose-200 text-rose-800">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Status: Cancelled
        </div>
      </div>

      {/* Cancellation Reason */}
      {parsedDetails.cancellationReason && (
        <div className="text-xs text-gray-700 bg-white/90 p-3 rounded-sm border border-rose-100/80">
          <span className="font-semibold text-gray-900 block mb-0.5">
            Cancellation Reason:
          </span>
          <p className="italic text-gray-600">
            &ldquo;{parsedDetails.cancellationReason}&rdquo;
          </p>
        </div>
      )}

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="p-3 bg-white rounded-sm border border-gray-200/80 space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">
            Performance Fee
          </span>
          <span className="font-mono font-bold text-sm text-gray-900 block">
            {totalAmount > 0
              ? `${currencyCode} ${totalAmount.toLocaleString()}`
              : 'Quote Pending'}
          </span>
        </div>

        <div className="p-3 bg-white rounded-sm border border-gray-200/80 space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">
            Schedule Status
          </span>
          <span className="text-xs font-semibold text-rose-700 block">
            Date Released from Schedule
          </span>
        </div>
      </div>

      {/* Direct Arrangement Guidance */}
      <div className="text-[11px] text-gray-600 leading-relaxed bg-white/80 p-3.5 rounded-sm border border-gray-200/80 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-gray-900 mb-0.5">
            Direct Settlement Policy:
          </p>
          <p>
            UpBeat Africa is a booking coordination platform. All performance
            fees and offline deposits are settled directly between you and{' '}
            {djStageName}. Any refunds or retained deposits are subject to your
            private direct arrangement.
          </p>
        </div>
      </div>
    </div>
  );
}
