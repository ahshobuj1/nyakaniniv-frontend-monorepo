'use client';

import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Clock,
  Loader2,
} from 'lucide-react';
import type { CancellationRefundPreview } from '@/lib/bookingStatusHelper';

interface CancelBookingModalProps {
  isOpen: boolean;
  isCanceling: boolean;
  currencyCode: string;
  totalAmount: number;
  formattedDate: string;
  displayTime: string;
  cancellationPreview: CancellationRefundPreview;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

/**
 * Full-screen modal that previews the refund policy tier, shows financial
 * calculations, collects an optional reason and confirms the cancellation.
 */
export function CancelBookingModal({
  isOpen,
  isCanceling,
  currencyCode,
  totalAmount,
  formattedDate,
  displayTime,
  cancellationPreview,
  onClose,
  onConfirm,
}: CancelBookingModalProps) {
  const [cancelReason, setCancelReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(cancelReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-sm shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={isCanceling}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-sm bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Cancel Booking Request
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Please review the remaining time and UpBeat Escrow refund settlement terms before confirming cancellation.
            </p>
          </div>
        </div>

        {/* Time Remaining Notice */}
        <div className="p-3 bg-gray-50 rounded-sm border border-gray-200 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Event Schedule
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-gray-800">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              {cancellationPreview.formattedRemainingTime}
            </span>
          </div>
          <p className="text-gray-900 font-semibold">
            {formattedDate} at {displayTime}
          </p>
        </div>

        {/* Refund Settlement Tier Preview */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">Applicable Policy Tier:</span>
            <span className={`px-2 py-0.5 rounded-sm text-xs font-bold border ${cancellationPreview.badgeClass}`}>
              {cancellationPreview.tierLabel}
            </span>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-sm text-[11px] text-amber-900 leading-relaxed">
            {cancellationPreview.tierDescription}
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-sm space-y-2 text-xs">
            <div className="flex justify-between items-center text-gray-600">
              <span>Total Booking Amount:</span>
              <span className="font-mono font-semibold text-gray-900">
                {currencyCode} {totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>Applicable Refund Rate:</span>
              <span className="font-mono font-semibold text-gray-900">
                {cancellationPreview.refundPercent}%
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-900">Estimated Refund to You:</span>
              <span className={`font-mono font-bold text-sm ${cancellationPreview.refundAmount > 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                {currencyCode} {cancellationPreview.refundAmount.toLocaleString()}
              </span>
            </div>
            {cancellationPreview.artistRetentionAmount > 0 && (
              <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1">
                <span>Retained by Artist (Schedule compensation):</span>
                <span className="font-mono">
                  {currencyCode} {cancellationPreview.artistRetentionAmount.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Escrow Rule Summary */}
          <div className="p-3 bg-gray-50/60 rounded-sm border border-gray-200/60 text-[10px] text-gray-500 space-y-1">
            <p className="font-bold uppercase tracking-wider text-gray-600">UpBeat Escrow Cancellation Policy:</p>
            <p>• 72+ hours: 100% full refund to original payment method.</p>
            <p>• 24–72 hours: 50% partial refund (50% compensates artist for reserved schedule).</p>
            <p>• &lt; 24 hours: Non-refundable (100% artist compensation).</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Reason for Cancellation <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              disabled={isCanceling}
              rows={2}
              placeholder="Please let the artist know why you need to cancel..."
              className="w-full rounded-sm border border-gray-300 p-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isCanceling}
              className="px-4 py-2 rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              Keep Booking
            </button>

            <button
              type="submit"
              disabled={isCanceling}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-sm bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              {isCanceling ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <span>Confirm Cancellation</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
