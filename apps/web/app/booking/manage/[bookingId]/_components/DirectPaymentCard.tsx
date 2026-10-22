/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {useState} from 'react';
import {
  Banknote,
  Building2,
  Phone,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Copy,
  Check,
} from 'lucide-react';
import {toast} from 'sonner';
import {useReportDirectPaymentMutation} from '@repo/store';
import {getDirectPaymentStatusBadge} from '@/lib/bookingStatusHelper';
import type {DirectPaymentCardProps} from './types';

export function DirectPaymentCard({
  booking,
  currencyCode,
  totalAmount,
  djStageName,
  onPaymentReported,
}: DirectPaymentCardProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [method, setMethod] = useState<
    'CASH' | 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'OTHER'
  >('CASH');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmedConsent, setConfirmedConsent] = useState(false);

  const [reportPayment, {isLoading}] = useReportDirectPaymentMutation();

  const directStatus = booking.directPaymentStatus || 'UNREPORTED';
  const statusBadge = getDirectPaymentStatusBadge(directStatus);

  // Tenant direct payment instructions configured by DJ in dashboard
  const instructions =
    (booking as any)?.paymentInstructions ||
    (booking.tenant as any)?.directPaymentInstructions;
  const hasBank = Boolean(
    instructions?.enabled &&
    (instructions.bankName || instructions.accountNumber),
  );
  const hasMobileMoney = Boolean(
    instructions?.enabled && instructions.mobileMoneyNumber,
  );

  // Active view tab
  const [activeTab, setActiveTab] = useState<'CASH' | 'BANK' | 'MOMO'>('CASH');

  const handleCopy = (text: string, fieldName: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleReportPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedConsent) {
      toast.error(
        'Please confirm that you have sent direct payment to the artist.',
      );
      return;
    }

    try {
      await reportPayment({
        id: booking.id,
        method,
        reference: reference.trim() || undefined,
        notes: notes.trim() || undefined,
      }).unwrap();

      toast.success(
        'Payment reported successfully! The artist has been notified to verify.',
      );
      setShowReportModal(false);
      if (onPaymentReported) onPaymentReported();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to report payment.');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-sm">
            <Banknote className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 leading-tight">
              Direct Artist Payment
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Settlement arranged directly with {djStageName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right sm:border-r sm:border-gray-200 sm:pr-3">
            <span className="text-[10px] text-gray-400 block uppercase font-medium">
              {(booking as any).agreement
                ? 'Agreed Fee'
                : totalAmount > 0
                  ? 'Proposed Fee'
                  : 'Fee'}
            </span>
            <span className="text-base font-bold font-mono text-gray-900">
              {totalAmount > 0
                ? `${currencyCode} ${totalAmount.toLocaleString()}`
                : 'Quote Pending'}
            </span>
          </div>

          <div
            className={`px-2.5 py-1 rounded-sm text-[11px] font-semibold border flex items-center gap-1.5 shrink-0 ${statusBadge.badgeClass}`}>
            <span
              className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotClass}`}
            />
            {statusBadge.label}
          </div>
        </div>
      </div>

      {/* Subtle Platform Insulation Note */}
      <div className="px-3.5 py-2.5 rounded-sm bg-gray-50 border border-gray-200/70 text-[11px] text-gray-600 flex items-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span>
          UpBeat Africa is a booking coordination platform. You settle directly
          with the artist without platform escrow or deduction fees.
        </span>
      </div>

      {/* Payment Method Selector Tabs */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5 border-b border-gray-100 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('CASH')}
            className={`px-3 py-1.5 rounded-sm text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'CASH'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
            <Banknote className="w-3.5 h-3.5" />
            <span>Cash on Arrival</span>
          </button>

          {hasBank && (
            <button
              type="button"
              onClick={() => setActiveTab('BANK')}
              className={`px-3 py-1.5 rounded-sm text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'BANK'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              <Building2 className="w-3.5 h-3.5" />
              <span>Bank Wire / EFT</span>
            </button>
          )}

          {hasMobileMoney && (
            <button
              type="button"
              onClick={() => setActiveTab('MOMO')}
              className={`px-3 py-1.5 rounded-sm text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'MOMO'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile Money</span>
            </button>
          )}
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'CASH' && (
          <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/80 rounded-sm text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-950">
                In-Person Cash Settlement
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Direct
              </span>
            </div>
            <p className="text-emerald-900 leading-relaxed text-[11px]">
              Hand over the agreed fee of{' '}
              <strong>
                {currencyCode} {totalAmount.toLocaleString()}
              </strong>{' '}
              directly to {djStageName} at the venue.
            </p>
            {instructions?.instructions && (
              <p className="text-[11px] text-emerald-900/80 italic pt-1 border-t border-emerald-200/60">
                Note: {instructions.instructions}
              </p>
            )}
          </div>
        )}

        {activeTab === 'BANK' && hasBank && (
          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-sm text-xs space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {instructions.bankName && (
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-medium">
                    Bank
                  </span>
                  <span className="font-semibold text-gray-900 text-xs">
                    {instructions.bankName}
                  </span>
                </div>
              )}
              {instructions.accountNumber && (
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-medium">
                    Account / IBAN
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono font-bold text-gray-900 text-xs bg-white px-2 py-0.5 rounded border border-gray-200">
                      {instructions.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(instructions.accountNumber, 'Account number')
                      }
                      className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                      title="Copy">
                      {copiedField === 'Account number' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              {instructions.accountName && (
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-medium">
                    Holder Name
                  </span>
                  <span className="font-medium text-gray-800 text-xs">
                    {instructions.accountName}
                  </span>
                </div>
              )}
            </div>
            {instructions.instructions && (
              <p className="text-[11px] text-gray-500 italic pt-1 border-t border-gray-200">
                Note: {instructions.instructions}
              </p>
            )}
          </div>
        )}

        {activeTab === 'MOMO' && hasMobileMoney && (
          <div className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-sm text-xs space-y-2">
            <div>
              <span className="text-amber-800 block text-[10px] uppercase font-semibold">
                {instructions.mobileMoneyProvider || 'M-Pesa / Mobile Money'}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono font-bold text-amber-950 text-sm bg-white px-2 py-0.5 rounded border border-amber-300">
                  {instructions.mobileMoneyNumber}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(instructions.mobileMoneyNumber, 'Mobile number')
                  }
                  className="p-1 rounded text-amber-700 hover:text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
                  title="Copy number">
                  {copiedField === 'Mobile number' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
            {instructions.instructions && (
              <p className="text-[11px] text-amber-900/80 italic pt-1 border-t border-amber-200/60">
                Note: {instructions.instructions}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action / Report Buttons */}
      <div className="pt-2">
        {directStatus === 'DJ_CONFIRMED' ? (
          <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-sm text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              The artist has confirmed receiving payment for this booking.
            </span>
          </div>
        ) : directStatus === 'CLIENT_REPORTED' ? (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-amber-50 border border-amber-200 p-2.5 rounded-sm text-xs">
            <div className="flex items-center gap-2 text-amber-900">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                You reported sending payment. The artist has been notified to
                verify.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="text-amber-800 underline font-semibold text-xs hover:text-amber-900 cursor-pointer">
              Update Report
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-sm shadow-xs transition-colors cursor-pointer">
            <Banknote className="w-4 h-4" />
            <span>Report Payment Made</span>
          </button>
        )}
      </div>

      {/* Report Payment Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-sm shadow-xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Report Direct Payment
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Notify {djStageName} that you have transferred or handed over
                  the funds.
                </p>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleReportPayment} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Payment Method Used
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="CASH">Cash (In-Person / Hand-to-Hand)</option>
                  <option value="MOBILE_MONEY">
                    Mobile Money (M-Pesa / MTN / Airtel)
                  </option>
                  <option value="BANK_TRANSFER">
                    Bank Wire / Electronic Funds Transfer
                  </option>
                  <option value="OTHER">Other Arrangement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Transaction / Transfer Reference (Optional)
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. Handed cash to DJ, or MPESA-Q4X91029"
                  className="w-full px-3 py-2 text-xs font-mono bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Additional Notes for Artist (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Paid advance deposit, or handed cash at venue"
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-sm">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-700 leading-snug">
                  <input
                    type="checkbox"
                    checked={confirmedConsent}
                    onChange={(e) => setConfirmedConsent(e.target.checked)}
                    className="mt-0.5 rounded-xs text-primary focus:ring-primary"
                    required
                  />
                  <span>
                    I confirm that I have arranged or sent direct payment of{' '}
                    <strong>
                      {currencyCode} {totalAmount.toLocaleString()}
                    </strong>{' '}
                    directly to {djStageName}. I understand UpBeat Africa does
                    not collect or hold these funds.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 text-xs font-semibold rounded-sm hover:bg-gray-50 cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !confirmedConsent}
                  className="px-5 py-2 bg-primary hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold rounded-sm shadow-xs transition-opacity cursor-pointer">
                  {isLoading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
