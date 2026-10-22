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
  AlertTriangle,
} from 'lucide-react';
import { Booking } from '@repo/store';
import { normalizeBookingStatus, getDirectPaymentStatusBadge } from '@/lib/bookingStatusHelper';
import { toast } from 'sonner';

interface ActionCenterCardProps {
  booking: Booking;
  isActionLoading: boolean;
  onOpenAcceptModal: () => void;
  onOpenRejectModal: () => void;
  onConfirmDirectPayment: () => void;
  onRequestCompletion: () => void;
  onCompleteEvent: () => void;
}

export function ActionCenterCard({
  booking,
  isActionLoading,
  onOpenAcceptModal,
  onOpenRejectModal,
  onConfirmDirectPayment,
  onRequestCompletion,
  onCompleteEvent,
}: ActionCenterCardProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const status = normalizeBookingStatus(booking.status);
  const directPaymentStatus = booking.directPaymentStatus || 'UNREPORTED';
  const directBadge = getDirectPaymentStatusBadge(directPaymentStatus);

  const isPending = status === 'PENDING';
  const isAccepted = status === 'ACCEPTED' || status === 'AWAITING_PAYMENT';
  const isConfirmed = status === 'CONFIRMED';
  const isCompleted = status === 'COMPLETED';
  const isDisputed = status === 'DISPUTED';

  const orderRef = booking.orderReference || `UB-${booking.id.slice(0, 8).toUpperCase()}`;
  const portalUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/booking/manage/${booking.id}?ref=${orderRef}`
    : `https://upbeat.africa/booking/manage/${booking.id}?ref=${orderRef}`;

  const handleCopyPortalLink = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopiedLink(true);
    toast.success('Client booking portal link copied to clipboard!');
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
              <span className="font-bold">New Booking Request: </span>
              Review event details and propose your fee. The client will be notified immediately to review your quotation.
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

        {/* 2. Accepted / Awaiting Agreement Actions */}
        {isAccepted && (
          <div className="space-y-3.5">
            <div className="p-3.5 bg-sky-50/80 border border-sky-200/70 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-600" />
                  Booking Accepted
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${directBadge.badgeClass}`}>
                  {directBadge.label}
                </span>
              </div>
              <p className="text-xs text-sky-800 leading-relaxed">
                {directPaymentStatus === 'CLIENT_REPORTED'
                  ? 'Client reported sending direct payment. Please check your bank/mobile account and confirm receipt.'
                  : 'Booking is accepted. Client can review quote, negotiate terms, and view your payout preferences.'}
              </p>
            </div>

            {/* Payment Status & Actions */}
            {directPaymentStatus === 'CLIENT_REPORTED' ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Payment Sent by Client</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  The client reported sending direct payment. Please check your bank or mobile money account and mark as received to keep your records updated.
                </p>
                <Button
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-bold h-11 rounded-xl shadow-xs text-xs flex items-center justify-center gap-2 cursor-pointer"
                  disabled={isActionLoading}
                  onClick={onConfirmDirectPayment}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Payment as Received</span>
                </Button>
              </div>
            ) : directPaymentStatus === 'DJ_CONFIRMED' ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Direct Payment Confirmed (Recorded)</span>
              </div>
            ) : (
              <div className="p-3.5 bg-sky-50/80 border border-sky-200/70 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-600" />
                    Direct Payment Arrangement
                  </span>
                </div>
                <p className="text-xs text-sky-800 leading-relaxed">
                  Payment is arranged directly between you and the client (cash on arrival, bank, or mobile money). UpBeat Africa does not hold or escrow funds.
                </p>
                {/* Secondary override for offline/cash receipt */}
                <div className="pt-2 border-t border-sky-200/50">
                  <button
                    type="button"
                    onClick={onConfirmDirectPayment}
                    disabled={isActionLoading}
                    className="text-[11px] font-semibold text-sky-700 hover:text-sky-900 hover:underline flex items-center gap-1 cursor-pointer">
                    <span>Received payment? Mark as Received in Records</span>
                  </button>
                </div>
              </div>
            )}

            {/* Decline Option */}
            <Button
              variant="outline"
              className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 font-semibold h-10 rounded-xl text-xs"
              disabled={isActionLoading}
              onClick={onOpenRejectModal}
            >
              Decline Booking
            </Button>

            {/* Copy Client Portal Link */}
            <div className="pt-2 border-t border-gray-100">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Client Booking Portal Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={portalUrl}
                  className="w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-gray-600 truncate select-all focus:outline-none"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCopyPortalLink}
                  className="rounded-xl shrink-0 px-3 h-9"
                  title="Copy link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Confirmed Booking Actions */}
        {isConfirmed && (
          <div className="space-y-3.5">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Booking Confirmed on Schedule
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Price agreement is locked and booking is confirmed on your calendar.
              </p>
            </div>

            {/* Direct Settlement Tracking */}
            {directPaymentStatus !== 'DJ_CONFIRMED' ? (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700">Direct Payment:</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${directBadge.badgeClass}`}>
                    {directBadge.label}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onConfirmDirectPayment}
                  disabled={isActionLoading}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Direct Payment Received</span>
                </button>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Payment Marked as Received</span>
              </div>
            )}

            {/* Request Completion Confirmation */}
            <Button
              variant="outline"
              className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 font-bold h-10 rounded-xl text-xs flex items-center justify-center gap-2"
              disabled={isActionLoading}
              onClick={onRequestCompletion}
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>Request Client Completion Confirmation</span>
            </Button>

            {/* Complete gig button */}
            <Button
              className="w-full bg-[#111827] hover:bg-black text-white font-bold h-11 rounded-xl shadow-xs text-xs"
              disabled={isActionLoading}
              onClick={onCompleteEvent}
            >
              Mark Gig Completed
            </Button>

            {/* Client Portal Link */}
            <div className="pt-2 border-t border-gray-100">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Client Booking Portal Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={portalUrl}
                  className="w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 text-gray-600 truncate select-all focus:outline-none"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCopyPortalLink}
                  className="rounded-xl shrink-0 px-3 h-9"
                  title="Copy link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Completed Status */}
        {isCompleted && (
          <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200/60 text-center space-y-2">
            <CheckCircle2 className="w-7 h-7 text-blue-600 mx-auto" />
            <div>
              <p className="text-sm font-bold text-blue-900">Gig Completed</p>
              <p className="text-xs text-blue-700 mt-0.5">
                This event concluded successfully. Performance records are archived.
              </p>
            </div>
          </div>
        )}

        {/* 5. Disputed Status */}
        {isDisputed && (
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Issue Reported by Client</span>
            </div>
            <p className="text-rose-800">
              {booking.issueDescription || 'A client issue was reported for this booking.'}
            </p>
          </div>
        )}

        {/* 6. Cancelled / Rejected */}
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
