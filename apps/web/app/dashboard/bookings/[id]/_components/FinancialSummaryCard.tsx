'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { CreditCard, FileText } from 'lucide-react';
import { Booking } from '@repo/store';

interface FinancialSummaryCardProps {
  booking: Booking;
}

export function FinancialSummaryCard({ booking }: FinancialSummaryCardProps) {
  const invoice = booking.invoice;
  const amountFormatted = booking.totalAmount
    ? `KES ${Number(booking.totalAmount).toFixed(2)}`
    : 'Pending';

  const getPaymentMethodLabel = () => {
    if (!invoice?.transactions?.length) return 'Card / Paystack';
    const successfulTx = invoice.transactions.find((tx) => tx.status === 'SUCCESS');
    const activeTx = successfulTx || invoice.transactions[0];
    if (!activeTx) return 'Card / Paystack';
    if (activeTx.channel === 'CASH' || activeTx.gateway === 'MANUAL') return 'Cash on Event';
    const channelName = activeTx.channel
      ? activeTx.channel.replace(/_/g, ' ')
      : activeTx.gateway
        ? activeTx.gateway.replace(/_/g, ' ')
        : 'Card';
    const gatewayLabel = activeTx.gateway
      ? activeTx.gateway.charAt(0).toUpperCase() + activeTx.gateway.slice(1).toLowerCase()
      : 'Paystack';
    return `${channelName} (${gatewayLabel})`;
  };

  const getPaymentDateLabel = () => {
    if (!invoice) return 'Paid';
    const successfulTx = invoice.transactions?.find((tx) => tx.status === 'SUCCESS');
    const dateToUse = successfulTx?.createdAt || invoice.updatedAt || booking.updatedAt;
    return dateToUse
      ? new Date(dateToUse).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'Paid';
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
        <CardTitle className="text-lg font-semibold text-[#111827] flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gray-400" />
          Financial Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {invoice ? (
          <div className="space-y-6">
            <div className="flex items-end justify-between pb-6 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                  Total Amount
                </p>
                <h2 className="text-3xl font-bold text-[#111827]">{amountFormatted}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#6B7280] uppercase tracking-wider text-[11px] mb-1">
                  Status
                </p>
                <p
                  className={`font-semibold ${
                    invoice.status === 'PAID' ? 'text-green-600' : 'text-amber-600'
                  }`}
                >
                  {invoice.status}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <p className="text-sm font-medium text-[#6B7280] text-[12px] mb-1">Invoice Number</p>
                <p className="text-sm font-medium text-[#111827] font-mono">
                  INV-{invoice.id.split('-')[0]?.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#6B7280] text-[12px] mb-1">Payment Method</p>
                <p className="text-sm font-semibold text-[#111827] capitalize">
                  {getPaymentMethodLabel()}
                </p>
              </div>
              {invoice.status === 'PAID' && (
                <div>
                  <p className="text-sm font-medium text-[#6B7280] text-[12px] mb-1">Payment Date</p>
                  <p className="text-sm font-medium text-[#111827]">
                    {getPaymentDateLabel()}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-[#6B7280] font-medium">No invoice generated</p>
            <p className="text-sm text-[#9CA3AF] mt-1">Payment details are currently unavailable.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
