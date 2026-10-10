'use client';

import {
  Ban,
} from 'lucide-react';
import type { ManageBookingContext } from './types';

interface CancellationSettlementProps {
  booking: ManageBookingContext['booking'];
  parsedDetails: ManageBookingContext['parsedDetails'];
  currencyCode: string;
  totalAmount: number;
  isPaid: boolean;
  djStageName: string;
}

/**
 * Shows the cancellation settlement card when a booking is CANCELLED.
 * Displays the refund breakdown, settlement status, and escrow notice.
 */
export function CancellationSettlement({
  booking,
  parsedDetails,
  currencyCode,
  totalAmount,
  isPaid,
  djStageName,
}: CancellationSettlementProps) {
  return (
    <div className="p-5 rounded-sm bg-rose-50/70 border border-rose-200/90 space-y-4">
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
              Cancelled by {parsedDetails.cancelledBy === 'CLIENT' ? 'You (Client)' : parsedDetails.cancelledBy === 'DJ' ? djStageName : 'System'}
              {booking.cancelledAt && ` on ${new Date(booking.cancelledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-bold border bg-white border-rose-200 text-rose-800">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Status: Cancelled
        </div>
      </div>

      {/* Reason */}
      {parsedDetails.cancellationReason && (
        <div className="text-xs text-gray-700 bg-white/90 p-3 rounded-sm border border-rose-100/80">
          <span className="font-semibold text-gray-900 block mb-0.5">Cancellation Reason:</span>
          <p className="italic text-gray-600">{parsedDetails.cancellationReason}</p>
        </div>
      )}

      {/* Refund Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3 bg-white rounded-sm border border-gray-200/80">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Booking Fee</span>
          <span className="font-mono font-bold text-sm text-gray-900 mt-0.5 block">
            {currencyCode} {totalAmount.toLocaleString()}
          </span>
        </div>

        <div className="p-3 bg-white rounded-sm border border-gray-200/80">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">
            Refund Amount ({parsedDetails.refundPercent ?? (parsedDetails.refundAmount ? 50 : 0)}%)
          </span>
          <span className={`font-mono font-bold text-sm mt-0.5 block ${Number(parsedDetails.refundAmount || 0) > 0 ? 'text-emerald-600' : 'text-gray-700'}`}>
            {currencyCode} {Number(parsedDetails.refundAmount || 0).toLocaleString()}
          </span>
        </div>

        <div className="p-3 bg-white rounded-sm border border-gray-200/80">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Refund Settlement</span>
          <div className="text-xs font-semibold mt-1">
            {parsedDetails.refundStatus === 'COMPLETED' ? (
              <span className="text-emerald-700 font-bold">✓ Completed</span>
            ) : parsedDetails.refundStatus === 'PROCESSING' ? (
              <span className="text-amber-700 font-bold">⏳ Processing (3–5 days)</span>
            ) : parsedDetails.refundStatus === 'MANUAL_REQUIRED' ? (
              <span className="text-blue-700 font-bold">⏳ Queued for Bank Payout</span>
            ) : Number(parsedDetails.refundAmount || 0) > 0 ? (
              <span className="text-amber-700 font-bold">⏳ Pending Refund</span>
            ) : (
              <span className="text-gray-500 font-medium">None (Unpaid / Late)</span>
            )}
          </div>
        </div>
      </div>

      {/* Informational Guidance */}
      <div className="text-[11px] text-gray-600 leading-relaxed bg-white/70 p-3 rounded-sm border border-gray-200/70">
        {Number(parsedDetails.refundAmount || 0) > 0 ? (
          <p>
            <strong>Refund Notice:</strong> A refund of{' '}
            <span className="font-bold text-emerald-700 font-mono">
              {currencyCode} {Number(parsedDetails.refundAmount).toLocaleString()}
            </span>{' '}
            has been authorized under the UpBeat Escrow Guarantee. Depending on your bank and card provider, refunds typically settle within 3–5 business days to the account or card used at checkout.
          </p>
        ) : isPaid ? (
          <p>
            <strong>Escrow Notice:</strong> Because this cancellation was requested less than 24 hours prior to the scheduled performance, the performance fee was retained to compensate {djStageName} for reserving their schedule in accordance with the UpBeat Escrow Terms.
          </p>
        ) : (
          <p>
            <strong>No Charge Notice:</strong> This booking was cancelled prior to payment completion. Your card was never charged, and no refund is required.
          </p>
        )}
      </div>
    </div>
  );
}
