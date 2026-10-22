'use client';

import { Card, CardContent, CardHeader, CardTitle, formatMoney } from '@repo/ui';
import { Banknote, ShieldAlert } from 'lucide-react';
import { Booking } from '@repo/store';
import { getDirectPaymentStatusBadge } from '@/lib/bookingStatusHelper';

interface FinancialSummaryCardProps {
  booking: Booking;
}

export function FinancialSummaryCard({ booking }: FinancialSummaryCardProps) {
  const directStatus = booking.directPaymentStatus || 'UNREPORTED';
  const badgeConfig = getDirectPaymentStatusBadge(directStatus);

  const amountFormatted = booking.totalAmount
    ? formatMoney(booking.totalAmount, booking.currencyCode || 'KES')
    : 'Pending Quote';

  const getDirectMethodLabel = () => {
    switch (booking.paymentMethod) {
      case 'CASH':
        return 'Cash on Arrival';
      case 'MOBILE_MONEY':
        return 'Mobile Money (Direct)';
      case 'BANK_TRANSFER':
        return 'Bank Wire / EFT';
      default:
        return 'Cash, Bank, or Mobile Money (Direct)';
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
        <CardTitle className="text-lg font-semibold text-[#111827] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-gray-500" />
            Financial & Direct Settlement Overview
          </span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${badgeConfig.badgeClass}`}>
            {badgeConfig.label}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-end justify-between pb-6 border-b border-gray-100">
          <div>
            <p className="text-sm font-medium text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
              Agreed / Proposed Fee
            </p>
            <h2 className="text-3xl font-bold text-[#111827]">{amountFormatted}</h2>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
              Settlement Status
            </p>
            <p className="font-semibold text-xs text-gray-800">
              {directStatus === 'DJ_CONFIRMED'
                ? 'Payment Confirmed'
                : directStatus === 'CLIENT_REPORTED'
                ? 'Reported by Client'
                : 'Direct Arrangement'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-[#6B7280] text-[12px] mb-1">Payment Method</p>
            <p className="text-sm font-semibold text-[#111827]">
              {getDirectMethodLabel()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-[#6B7280] text-[12px] mb-1">Reference Number</p>
            <p className="text-sm font-medium text-[#111827] font-mono">
              {booking.orderReference || `UB-${booking.id.slice(0, 8).toUpperCase()}`}
            </p>
          </div>
        </div>

        {/* Regulatory / Direct settlement notice */}
        <div className="p-3.5 bg-gray-50 border border-gray-200/80 rounded-xl text-xs text-gray-600 flex items-start gap-2.5 leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <span>
            <strong>Direct Payment Model:</strong> UpBeat Africa acts solely as a booking coordination platform. You receive 100% of your performance fees directly from the client without platform escrow or gateway processing fees.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
