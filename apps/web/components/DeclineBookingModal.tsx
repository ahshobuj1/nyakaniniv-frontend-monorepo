'use client';

import React, { useState, useEffect } from 'react';
import { XCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
} from '@repo/ui';
import { DeclineBookingModalProps } from '@/types/booking.types';

const COMMON_REASONS = [
  'Unavailable on this date',
  'Already fully booked',
  'Outside my service area',
  'Schedule conflict',
  'Event type not supported',
];

export function DeclineBookingModal({
  isOpen,
  clientName,
  eventType,
  isLoading = false,
  onClose,
  onConfirm,
}: DeclineBookingModalProps) {
  const [reason, setReason] = useState('');
  const [hasSubmittedAttempt, setHasSubmittedAttempt] = useState(false);

  // Reset reason when modal closes or opens
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReason('');
      setHasSubmittedAttempt(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmittedAttempt(true);
    if (!reason.trim()) {
      return;
    }
    onConfirm(reason.trim());
  };

  const isReasonValid = reason.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl p-6 border-none shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 text-rose-600">
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-200/60">
              <XCircle className="w-5 h-5 text-rose-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Decline Booking Request
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-gray-600 pt-2">
            Decline the booking request for{' '}
            <strong className="text-gray-900">{eventType || 'this event'}</strong> from{' '}
            <strong className="text-gray-900">{clientName || 'the client'}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Warning Notice */}
          <div className="p-3 bg-amber-50/90 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-bold">Required Note: </span>
              The client will receive an official cancellation email with your decline note. This action cannot be undone.
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Quick Suggestions (Click to fill)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setReason(preset)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    reason === preset
                      ? 'bg-rose-50 border-rose-300 text-rose-700 font-semibold shadow-2xs'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea Reason */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="decline-reason-input"
                className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                Reason for Declining <span className="text-rose-600">*</span>
              </label>
              <span className="text-[11px] text-gray-400">
                {reason.trim().length} characters
              </span>
            </div>
            <textarea
              id="decline-reason-input"
              rows={3}
              required
              autoFocus
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Write a clear note explaining why you cannot take this booking (e.g. booked elsewhere, personal conflict, travel constraints)..."
              className={`w-full text-sm p-3 rounded-xl border bg-gray-50/50 focus:bg-white transition-all outline-none resize-none ${
                hasSubmittedAttempt && !isReasonValid
                  ? 'border-rose-400 ring-2 ring-rose-200'
                  : 'border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200'
              }`}
            />
            {hasSubmittedAttempt && !isReasonValid && (
              <p className="text-xs text-rose-600 font-medium">
                Please enter a reason for declining before submitting.
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl h-10 px-4 cursor-pointer"
            >
              Keep Booking
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isReasonValid}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-10 px-5 font-bold shadow-md shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Declining Booking...' : 'Decline & Send Reason'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
