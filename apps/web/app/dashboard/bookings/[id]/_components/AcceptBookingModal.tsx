'use client';

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from '@repo/ui';
import { Banknote } from 'lucide-react';
import { Booking } from '@repo/store';

interface AcceptBookingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking;
  amountInput: string;
  onAmountInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function AcceptBookingModal({
  isOpen,
  onOpenChange,
  booking,
  amountInput,
  onAmountInputChange,
  onSubmit,
  isLoading,
}: AcceptBookingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl p-6 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Banknote className="w-5 h-5 text-emerald-500" />
            Accept Booking & Propose Quote
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <p className="text-sm text-gray-600 leading-relaxed">
            Accept this booking by proposing your fee for this performance. The client will be notified immediately to review your quotation and event details.
          </p>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Proposed Fee ({booking.currencyCode || 'KES'})
            </label>
            <Input
              type="number"
              min="1"
              step="any"
              placeholder="e.g. 50000"
              value={amountInput}
              onChange={(e) => onAmountInputChange(e.target.value)}
              required
              autoFocus
              className="h-11 rounded-xl"
            />
          </div>

          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 leading-snug">
            <strong>Platform Terms:</strong> UpBeat Africa is a booking coordination platform and does not process or deduct fees from your performance payments. All financial arrangements are handled directly between you and the client.
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="rounded-xl h-10 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !amountInput}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-5 font-bold"
            >
              {isLoading ? 'Accepting Booking...' : 'Confirm & Accept Booking'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
