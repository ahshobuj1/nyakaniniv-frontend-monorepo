'use client';

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from '@repo/ui';
import { CheckCircle2 } from 'lucide-react';

interface ConfirmCashPaymentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  confirmationText: string;
  onConfirmationTextChange: (value: string) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function ConfirmCashPaymentModal({
  isOpen,
  onOpenChange,
  confirmationText,
  onConfirmationTextChange,
  onConfirm,
  isLoading,
}: ConfirmCashPaymentModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          onConfirmationTextChange('');
        }
      }}
    >
      <DialogContent className="sm:max-w-[460px] bg-white rounded-2xl p-6 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Confirm Cash Payment Received
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm leading-relaxed">
            <strong>Important:</strong> Marking this payment as received will immediately mark the
            invoice as <strong>PAID</strong> and transition this booking to{' '}
            <strong>COMPLETED</strong> status.
          </div>
          <p className="text-sm text-gray-600">
            To prevent accidental completion, please confirm by typing{' '}
            <span className="font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded border">
              PAID
            </span>{' '}
            below:
          </p>
          <Input
            type="text"
            placeholder="Type PAID to confirm"
            value={confirmationText}
            onChange={(e) => onConfirmationTextChange(e.target.value)}
            className="h-11 rounded-xl text-center font-bold tracking-wider uppercase text-base"
            autoFocus
          />
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onConfirmationTextChange('');
              }}
              disabled={isLoading}
              className="rounded-xl h-10 px-4"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isLoading || confirmationText.trim().toUpperCase() !== 'PAID'}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-5 font-bold shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              {isLoading ? 'Completing Booking...' : 'Confirm Cash Received'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
