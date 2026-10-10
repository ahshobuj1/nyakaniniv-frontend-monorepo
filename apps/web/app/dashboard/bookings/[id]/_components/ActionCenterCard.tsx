/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import {
  CheckCircle2,
  Clock,
  Send,
  Copy,
  Check,
  AlertCircle,
  Banknote,
  ShieldCheck,
} from 'lucide-react';
import { Booking } from '@repo/store';
import { normalizeBookingStatus } from '@/lib/bookingStatusHelper';
import { toast } from 'sonner';

interface ActionCenterCardProps {
  booking: Booking;
  isActionLoading: boolean;
  onOpenAcceptModal: () => void;
  onOpenRejectModal: () => void;
  onApproveCash: () => void;
  onRejectCash: () => void;
  onOpenCashConfirmModal: () => void;
  onCompleteEvent: () => void;
  onResendReminder?: () => Promise<void>;
  isReminderLoading?: boolean;
}

export function ActionCenterCard({
  booking,
  isActionLoading,
  onOpenAcceptModal,
  onOpenRejectModal,
  onApproveCash,
  onRejectCash,
  onOpenCashConfirmModal,
  onCompleteEvent,
  onResendReminder,
  isReminderLoading = false,
}: ActionCenterCardProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const status = normalizeBookingStatus(booking.status);
  const isCompleted = status === 'COMPLETED';
  const isConfirmed = status === 'CONFIRMED';
  const isAwaitingPayment = status === 'AWAITING_PAYMENT';
  const isPending = status === 'PENDING';

  // Check cash transactions
  const cashTransaction = booking.invoice?.transactions?.find(
    (tx: any) => tx.gateway === 'CASH' || tx.gateway === 'MANUAL' || tx.channel === 'CASH'
  );

  const isPendingCashRequest =
    (isAwaitingPayment || isPending) &&
    (cashTransaction?.status === 'PENDING' && !cashTransaction?.metadata?.cashApproved);

  const isApprovedCashRequest =
    isConfirmed &&
    (booking.paymentMethod === 'CASH' || cashTransaction?.gateway === 'CASH' || Boolean(cashTransaction?.metadata?.cashApproved)) &&
    booking.paymentStatus !== 'PAID';

  const checkoutUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/checkout/${booking.id}`
    : `https://upbeat.africa/checkout/${booking.id}`;

  const handleCopyCheckoutLink = () => {
    navigator.clipboard.writeText(checkoutUrl);
    setCopiedLink(true);
    toast.success('Client checkout link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-5">
        <CardTitle className="text-base font-bold text-[#111827] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Action Center
          </span>
          <span className="text-xs uppercase font-mono px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
            {status}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {/* 1. Pending Booking Actions */}
        {isPending && (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-xl text-xs text-amber-800 leading-relaxed">
              <span className="font-bold">Action Required: </span>
              Review the client request and accept with your price quote. An official invoice and payment link will be sent to the client.
            </div>
            <Button
              className="w-full bg-[#111827] text-white hover:bg-black font-bold h-11 rounded-xl shadow-xs"
              disabled={isActionLoading}
              onClick={onOpenAcceptModal}
            >
              Accept Booking Request
            </Button>
            <Button
              variant="outline"
              className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 font-semibold h-10 rounded-xl"
              disabled={isActionLoading}
              onClick={onOpenRejectModal}
            >
              Decline Request
            </Button>
          </div>
        )}

        {/* 2. Awaiting Payment Actions */}
        {isAwaitingPayment && (
          <div className="space-y-3.5">
            {/* Cash payment requested by client */}
            {isPendingCashRequest ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                    <Banknote className="w-4 h-4 text-amber-600" />
                    Cash Payment Requested
                  </div>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    The client wants to pay in cash on-site instead of card/mobile money.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    className="w-full bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold h-10 rounded-xl"
                    disabled={isActionLoading}
                    onClick={onApproveCash}
                  >
                    Approve Cash
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-xs font-semibold h-10 rounded-xl border-gray-300"
                    disabled={isActionLoading}
                    onClick={onRejectCash}
                  >
                    Decline Cash
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-orange-50/80 border border-orange-200/70 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-orange-800 font-bold text-xs uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-orange-600" />
                  Awaiting Client Payment
                </div>
                <p className="text-xs text-orange-700 leading-relaxed">
                  Booking is approved. The client was emailed the payment link and must pay to lock your date.
                </p>
              </div>
            )}

            {/* Resend Reminder button */}
            {onResendReminder && (
              <Button
                variant="outline"
                className="w-full border-[#E5E7EB] hover:bg-gray-50 text-gray-800 text-xs font-bold h-10 rounded-xl flex items-center justify-center gap-2"
                disabled={isReminderLoading || isActionLoading}
                onClick={onResendReminder}
              >
                <Send className="w-3.5 h-3.5 text-primary" />
                <span>{isReminderLoading ? 'Sending Reminder...' : 'Resend Payment Reminder Email'}</span>
              </Button>
            )}

            {/* Decline Booking Option */}
            {onOpenRejectModal && (
              <Button
                variant="outline"
                className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 font-semibold h-10 rounded-xl text-xs"
                disabled={isActionLoading}
                onClick={onOpenRejectModal}
              >
                Decline Booking Request
              </Button>
            )}

            {/* Copy Client Checkout Link */}
            <div className="pt-2 border-t border-gray-100">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Direct Client Checkout Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={checkoutUrl}
                  className="w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-gray-600 truncate select-all focus:outline-none"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCopyCheckoutLink}
                  className="rounded-xl shrink-0 px-3 h-9"
                  title="Copy link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Confirmed Booking Actions (Cash or Online Escrow) */}
        {isConfirmed && (
          <div className="space-y-3.5">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Booking Confirmed & Secured
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                {isApprovedCashRequest
                  ? 'Client is paying cash in hand at the venue.'
                  : 'Client payment is locked safely in Escrow until you complete the event.'}
              </p>
            </div>

            {/* If cash booking awaiting venue receipt */}
            {isApprovedCashRequest && (
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl shadow-xs text-xs"
                disabled={isActionLoading}
                onClick={onOpenCashConfirmModal}
              >
                Mark Cash Received (Venue)
              </Button>
            )}

            {/* Complete gig & release escrow */}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-xs text-xs"
              disabled={isActionLoading}
              onClick={onCompleteEvent}
            >
              Complete Gig & Release Escrow
            </Button>
          </div>
        )}

        {/* 4. Completed Status */}
        {isCompleted && (
          <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200/60 text-center space-y-2">
            <CheckCircle2 className="w-7 h-7 text-blue-600 mx-auto" />
            <div>
              <p className="text-sm font-bold text-blue-900">Gig Completed</p>
              <p className="text-xs text-blue-700 mt-0.5">
                Escrow funds have been credited directly to your Available Balance in your Wallet.
              </p>
            </div>
          </div>
        )}

        {/* 5. Cancelled / Rejected */}
        {(status === 'CANCELLED' || status === 'REJECTED') && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center space-y-1">
            <AlertCircle className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-sm font-bold text-gray-700 capitalize">{status.toLowerCase()}</p>
            <p className="text-xs text-gray-500">This booking request is inactive.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
