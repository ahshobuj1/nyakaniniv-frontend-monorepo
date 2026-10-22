'use client';

import React, {useState} from 'react';
import {X, Calendar, Loader2, ShieldAlert, Ban} from 'lucide-react';

interface CancelBookingModalProps {
  isOpen: boolean;
  isCanceling: boolean;
  currencyCode: string;
  totalAmount: number;
  formattedDate: string;
  displayTime: string;
  djStageName?: string;
  isConfirmedBooking?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

/**
 * Cancellation modal tailored to the Direct Booking model.
 * Clearly explains schedule release, direct settlement resolution, and collects an optional reason.
 */
export function CancelBookingModal({
  isOpen,
  isCanceling,
  currencyCode,
  totalAmount,
  formattedDate,
  displayTime,
  djStageName = 'the artist',
  isConfirmedBooking = false,
  onClose,
  onConfirm,
}: CancelBookingModalProps) {
  const [cancelReason, setCancelReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(cancelReason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-sm shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={isCanceling}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-sm bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
            <Ban className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {isConfirmedBooking
                ? 'Cancel Confirmed Booking'
                : 'Cancel Booking Request'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Are you sure you want to cancel this booking with {djStageName}?
            </p>
          </div>
        </div>

        {/* Event Schedule & Fee Summary */}
        <div className="p-3.5 bg-gray-50 rounded-sm border border-gray-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Event Schedule
            </span>
            <span className="font-mono font-bold text-gray-900">
              {totalAmount > 0
                ? `${currencyCode} ${totalAmount.toLocaleString()}`
                : 'Quote Pending'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-800 font-semibold pt-1">
            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              {formattedDate} at {displayTime}
            </span>
          </div>
        </div>

        {/* Cancellation Consequence Notice */}
        <div className="p-3 rounded-sm bg-rose-50/70 border border-rose-200/70 text-xs text-rose-950 leading-relaxed space-y-1">
          <span className="font-bold block">
            {isConfirmedBooking
              ? 'Releasing Reserved Schedule'
              : 'Closing Booking Inquiry'}
          </span>
          <p className="text-[11px] text-rose-900">
            {isConfirmedBooking
              ? `This will release the reserved date on ${djStageName}'s calendar and notify the artist immediately.`
              : `This booking request will be closed and removed from ${djStageName}'s pending inquiries.`}
          </p>
        </div>

        {/* Direct Booking Platform Notice */}
        <div className="p-3 rounded-sm bg-gray-50 border border-gray-200 text-[11px] text-gray-600 leading-relaxed flex items-start gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
          <span>
            <strong>Direct Settlement:</strong> UpBeat Africa is a booking
            coordination platform and does not hold escrow funds. Any advance
            payments or offline refunds are handled directly between you and{' '}
            {djStageName}.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Reason for Cancellation{' '}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              disabled={isCanceling}
              rows={2}
              placeholder="Please let the artist know why you need to cancel..."
              className="w-full rounded-sm border border-gray-300 p-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary transition-all resize-none bg-gray-50/40"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isCanceling}
              className="px-4 py-2 rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer">
              Keep Booking
            </button>

            <button
              type="submit"
              disabled={isCanceling}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-sm bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50">
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
