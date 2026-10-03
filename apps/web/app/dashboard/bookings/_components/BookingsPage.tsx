'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Mail,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Eye,
  Send,
  MoreVertical,
  DollarSign,
  XCircle,
  Banknote,
  Copy,
  Check,
  FileText,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Button,
  MoneyDisplay,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@repo/ui';
import {
  useGetMyBookingsQuery,
  useUpdateBookingStatusMutation,
  useHandleCashRequestDecisionMutation,
  useMarkCashAsPaidMutation,
  useResendPaymentReminderMutation,
} from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { DeclineBookingModal } from '@/components/DeclineBookingModal';
import { normalizeBookingStatus, getBookingStatusBadge, parseBookingEventDetails } from '@/lib/bookingStatusHelper';
import { formatDateInTz, formatTimeInTz } from '@/lib/timezone';
import { toast } from 'sonner';

type FilterType = 'All' | 'pending' | 'awaiting_payment' | 'confirmed' | 'completed' | 'canceled';

interface ActiveBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  eventType: string;
  currencyCode: string;
  totalAmount?: number | null;
}

export default function BookingsPage() {
  const [filter, setFilter] = useState<FilterType>('All');
  const [copiedBookingId, setCopiedBookingId] = useState<string | null>(null);

  // APIs
  const { data: bookingsResponse, isLoading: isBookingsLoading } = useGetMyBookingsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const [handleCash, { isLoading: handlingCash }] = useHandleCashRequestDecisionMutation();
  const [markPaid, { isLoading: isMarkingPaid }] = useMarkCashAsPaidMutation();
  const [resendReminder, { isLoading: isSendingReminder }] = useResendPaymentReminderMutation();
  const isActionLoading = isUpdating || handlingCash || isMarkingPaid;

  // Specific Action Modals State
  const [acceptBooking, setAcceptBooking] = useState<ActiveBooking | null>(null);
  const [quotePrice, setQuotePrice] = useState('');

  const [declineBooking, setDeclineBooking] = useState<ActiveBooking | null>(null);

  const [approveCashBooking, setApproveCashBooking] = useState<ActiveBooking | null>(null);
  const [declineCashBooking, setDeclineCashBooking] = useState<ActiveBooking | null>(null);

  const [completeEscrowBooking, setCompleteEscrowBooking] = useState<ActiveBooking | null>(null);

  const [cashPaidBooking, setCashPaidBooking] = useState<ActiveBooking | null>(null);
  const [cashConfirmationText, setCashConfirmationText] = useState('');

  const [reminderBooking, setReminderBooking] = useState<ActiveBooking | null>(null);

  const bookings = bookingsResponse?.data || [];

  // Derived state for counts using canonical statuses
  const pendingCount = bookings.filter((b: any) => normalizeBookingStatus(b.status) === 'PENDING').length;
  const awaitingPaymentCount = bookings.filter((b: any) => normalizeBookingStatus(b.status) === 'AWAITING_PAYMENT').length;
  const confirmedCount = bookings.filter((b: any) => normalizeBookingStatus(b.status) === 'CONFIRMED').length;
  const completedCount = bookings.filter((b: any) => normalizeBookingStatus(b.status) === 'COMPLETED').length;
  const canceledCount = bookings.filter((b: any) => {
    const s = normalizeBookingStatus(b.status);
    return s === 'CANCELLED' || s === 'REJECTED';
  }).length;
  const totalCount = bookings.length;

  const filteredBookings = bookings.filter((booking: any) => {
    if (filter === 'All') return true;
    const s = normalizeBookingStatus(booking.status);
    if (filter === 'pending') return s === 'PENDING';
    if (filter === 'awaiting_payment') return s === 'AWAITING_PAYMENT';
    if (filter === 'confirmed') return s === 'CONFIRMED';
    if (filter === 'completed') return s === 'COMPLETED';
    if (filter === 'canceled') return s === 'CANCELLED' || s === 'REJECTED';
    return true;
  });

  // Action handlers
  const handleConfirmAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptBooking) return;
    const amountNum = parseFloat(quotePrice);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid price amount');
      return;
    }

    try {
      await updateStatus({
        id: acceptBooking.id,
        status: 'AWAITING_PAYMENT',
        totalAmount: amountNum,
        currencyCode: acceptBooking.currencyCode || 'KES',
      }).unwrap();
      toast.success('Booking accepted! Client has been emailed the checkout link.');
      setAcceptBooking(null);
      setQuotePrice('');
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to accept booking');
    }
  };

  const handleConfirmDecline = async (reason: string) => {
    if (!declineBooking) return;
    try {
      await updateStatus({
        id: declineBooking.id,
        status: 'REJECTED',
        reason: reason.trim(),
      }).unwrap();
      toast.success('Booking declined and reason emailed to client');
      setDeclineBooking(null);
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to decline booking');
    }
  };

  const handleConfirmResendReminder = async () => {
    if (!reminderBooking) return;
    try {
      await resendReminder(reminderBooking.id).unwrap();
      toast.success('Payment reminder email sent to client successfully!');
      setReminderBooking(null);
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to send reminder');
    }
  };

  const handleCopyCheckoutLink = (bookingId: string) => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/checkout/${bookingId}`
      : `https://upbeat.africa/checkout/${bookingId}`;
    navigator.clipboard.writeText(url);
    setCopiedBookingId(bookingId);
    toast.success('Direct client checkout link copied to clipboard!');
    setTimeout(() => setCopiedBookingId(null), 2000);
  };

  const handleConfirmApproveCash = async () => {
    if (!approveCashBooking) return;
    try {
      await handleCash({ id: approveCashBooking.id, decision: 'approve' }).unwrap();
      toast.success('Cash payment approved! Booking confirmed and client notified.');
      setApproveCashBooking(null);
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to approve cash request');
    }
  };

  const handleConfirmDeclineCash = async () => {
    if (!declineCashBooking) return;
    try {
      await handleCash({ id: declineCashBooking.id, decision: 'reject' }).unwrap();
      toast.success('Cash request declined. Online checkout link emailed to client.');
      setDeclineCashBooking(null);
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to decline cash request');
    }
  };

  const handleConfirmCompleteEscrow = async () => {
    if (!completeEscrowBooking) return;
    try {
      await updateStatus({ id: completeEscrowBooking.id, status: 'COMPLETED' }).unwrap();
      toast.success('Gig marked as completed! Escrow funds released into your wallet.');
      setCompleteEscrowBooking(null);
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to complete gig');
    }
  };

  const handleConfirmMarkCashPaid = async () => {
    if (!cashPaidBooking) return;
    if (cashConfirmationText.trim().toUpperCase() !== 'PAID') {
      toast.error('Please type PAID to confirm');
      return;
    }
    try {
      await markPaid(cashPaidBooking.id).unwrap();
      toast.success('Payment marked as paid via Cash and booking completed!');
      setCashPaidBooking(null);
      setCashConfirmationText('');
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to mark as paid');
    }
  };

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen p-4 md:p-2 font-sans">
      <div className="mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-[28px] font-bold tracking-tight text-[#111620]">
              Booking Requests
            </h1>
            <p className="text-[#787878] text-[15px]">
              Manage your DJ bookings, invoices, and payments in one organized workspace.
            </p>
          </div>
        </div>

        {/* Alert Banner */}
        {pendingCount > 0 && (
          <div className="bg-[#FFF8E6] border border-[#FDE68A] rounded-sm p-4 flex items-center gap-3 text-[#D97706]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-[15px]">
              You have{' '}
              <span className="font-bold">
                {pendingCount} pending booking {pendingCount === 1 ? 'request' : 'requests'}
              </span>{' '}
              waiting for your review and quote.
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2.5 pt-2 pb-2 overflow-x-auto">
          <button
            onClick={() => setFilter('All')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all border shrink-0 cursor-pointer ${
              filter === 'All'
                ? 'border-primary text-primary bg-white shadow-xs'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            All
            <span
              className={`flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'All' ? 'bg-primary' : 'bg-[#D1D5DB]'
              }`}>
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all border shrink-0 cursor-pointer ${
              filter === 'pending'
                ? 'border-primary text-primary bg-white shadow-xs'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            Pending
            <span
              className={`flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'pending' ? 'bg-primary' : 'bg-[#D1D5DB]'
              }`}>
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('awaiting_payment')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all border shrink-0 cursor-pointer ${
              filter === 'awaiting_payment'
                ? 'border-primary text-primary bg-white shadow-xs'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            Awaiting Payment
            <span
              className={`flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'awaiting_payment' ? 'bg-orange-500' : 'bg-[#D1D5DB]'
              }`}>
              {awaitingPaymentCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('confirmed')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all border shrink-0 cursor-pointer ${
              filter === 'confirmed'
                ? 'border-primary text-primary bg-white shadow-xs'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            Confirmed
            <span
              className={`flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'confirmed' ? 'bg-emerald-600' : 'bg-[#D1D5DB]'
              }`}>
              {confirmedCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('completed')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all border shrink-0 cursor-pointer ${
              filter === 'completed'
                ? 'border-primary text-primary bg-white shadow-xs'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            Completed
            <span
              className={`flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'completed' ? 'bg-blue-600' : 'bg-[#D1D5DB]'
              }`}>
              {completedCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('canceled')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all border shrink-0 cursor-pointer ${
              filter === 'canceled'
                ? 'border-primary text-primary bg-white shadow-xs'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            Canceled
            <span
              className={`flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'canceled' ? 'bg-gray-600' : 'bg-[#D1D5DB]'
              }`}>
              {canceledCount}
            </span>
          </button>
        </div>

        {/* Table Card */}
        {isBookingsLoading ? (
          <LoadingSpinner />
        ) : (
          <Card className="border border-gray-200 shadow-xs overflow-hidden rounded-sm bg-white">
            <CardContent className="p-0">
              <div className="p-4 md:p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-[18px] font-bold text-[#111620]">Bookings</h2>
                <span className="text-xs text-gray-500 font-medium">
                  Showing {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-225 text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Client
                      </th>
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Event Type
                      </th>
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Event Date
                      </th>
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Payment & Amount
                      </th>
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider text-right pr-8">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking: any, index: number) => {
                        const status = normalizeBookingStatus(booking.status);
                        const isPending = status === 'PENDING';
                        const isAwaitingPayment = status === 'AWAITING_PAYMENT';
                        const isConfirmed = status === 'CONFIRMED';
                        const isCompleted = status === 'COMPLETED';

                        const cashTransaction = booking.invoice?.transactions?.find(
                          (tx: any) => tx.gateway === 'CASH' || tx.gateway === 'MANUAL' || tx.channel === 'CASH'
                        );

                        // Strict state checks:
                        // Cash request can ONLY be pending if booking status is AWAITING_PAYMENT (or PENDING) and transaction status is PENDING without cashApproved
                        const isPendingCashRequest =
                          (isAwaitingPayment || isPending) &&
                          cashTransaction?.status === 'PENDING' &&
                          !cashTransaction?.metadata?.cashApproved;

                        // Approved cash request is ONLY active if booking is CONFIRMED and payment is not yet PAID
                        const isApprovedCashRequest =
                          isConfirmed &&
                          (booking.paymentMethod === 'CASH' || cashTransaction?.gateway === 'CASH' || Boolean(cashTransaction?.metadata?.cashApproved)) &&
                          booking.paymentStatus !== 'PAID';

                        const isInvoicePaid = booking.invoice?.status === 'PAID' || booking.paymentStatus === 'PAID';
                        const badge = getBookingStatusBadge(booking.status, booking.eventDate);

                        const bookingInfo: ActiveBooking = {
                          id: booking.id,
                          clientName: booking.client?.name || 'Client',
                          clientEmail: booking.client?.email || 'N/A',
                          eventType: booking.eventType || 'Event',
                          currencyCode: booking.currencyCode || 'KES',
                          totalAmount: booking.totalAmount,
                        };

                        return (
                          <tr
                            key={booking.id}
                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFB]'} hover:bg-gray-50/80 transition-colors`}>
                            {/* Client Column */}
                            <td className="py-5 px-6 text-[14px] font-semibold text-[#111620]">
                              <div className="flex flex-col gap-1">
                                <a
                                  href={`/dashboard/bookings/${booking.id}`}
                                  className="hover:text-primary transition-colors font-bold flex items-center gap-1.5"
                                >
                                  <span>{booking.client?.name || 'Unknown Client'}</span>
                                </a>
                                <span className="text-[12px] text-[#787878] font-normal flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5 shrink-0" />
                                  <span className="truncate max-w-[170px]">{booking.client?.email || 'N/A'}</span>
                                </span>
                              </div>
                            </td>

                            {/* Phone Column */}
                            <td className="py-5 px-6 text-[14px] text-[#787878]">
                              {booking.client?.phone ? (
                                <span className="text-[13px] font-medium flex items-center gap-1.5 text-[#111620]">
                                  <Phone className="w-3.5 h-3.5 shrink-0 text-[#787878]" />
                                  <span className="truncate">{booking.client.phone}</span>
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">-</span>
                              )}
                            </td>

                            {/* Event Type Column */}
                            <td className="py-5 px-6 text-[14px] text-[#787878]">
                              <div className="flex flex-col gap-1">
                                <span className="font-semibold text-[#111620] capitalize">{booking.eventType}</span>
                                {booking.address && (
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[12px] text-[#787878] hover:text-primary font-normal flex items-center gap-1.5 transition-colors group"
                                    title={`Open in Google Maps: ${booking.address}`}
                                  >
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-primary group-hover:scale-110 transition-transform" />
                                    <span className="truncate max-w-[160px] group-hover:underline">{booking.address}</span>
                                  </a>
                                )}
                              </div>
                            </td>

                            {/* Event Date Column */}
                            <td className="py-5 px-6 text-[14px] text-[#787878]">
                              {(() => {
                                const targetTz = booking.eventTimezone || 'Africa/Nairobi';
                                const dateFormatted = formatDateInTz(booking.eventDate, targetTz, {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                });
                                const timeFormatted = formatTimeInTz(booking.eventDate, targetTz);
                                return (
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 font-medium text-[#111620] w-max text-xs">
                                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                      {dateFormatted}
                                    </div>
                                    {timeFormatted && (
                                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60 w-max">
                                        <Clock className="w-3 h-3" />
                                        {timeFormatted}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </td>

                            {/* Combined Payment & Amount Column */}
                            <td className="py-5 px-6 text-[14px]">
                              <div className="flex flex-col items-start gap-1.5">
                                <span className="font-bold text-[#111620]">
                                  {booking.totalAmount ? (
                                    <MoneyDisplay amount={booking.totalAmount} currencyCode={booking.currencyCode || 'KES'} />
                                  ) : (
                                    <span className="text-gray-400 font-normal text-xs italic">Quote Pending</span>
                                  )}
                                </span>
                                {booking.invoice ? (
                                  isInvoicePaid ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Paid
                                    </span>
                                  ) : isApprovedCashRequest ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold">
                                      <Banknote className="w-3 h-3" />
                                      Cash Approved
                                    </span>
                                  ) : isPendingCashRequest ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold">
                                      <Clock className="w-3 h-3" />
                                      Cash Pending
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-gray-100 border border-gray-200 text-gray-600 text-[11px] font-medium">
                                      <Clock className="w-3 h-3" />
                                      Unpaid
                                    </span>
                                  )
                                ) : (
                                  <span className="text-[11px] text-gray-400 italic">Not Invoiced</span>
                                )}
                              </div>
                            </td>

                            {/* Status Column (Clean Badge Only) */}
                            <td className="py-5 px-6">
                              <div className="flex flex-col items-start gap-1.5">
                                <div
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm border text-xs font-semibold uppercase tracking-wider ${badge.badgeClass}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
                                  {badge.label}
                                </div>
                                {isPendingCashRequest && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[11px] font-bold bg-[#FFF8E6] border border-[#FDE68A] text-[#D97706]">
                                    <Banknote className="w-3 h-3" />
                                    Cash Requested
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Actions Column (Action Menu Popover + Quick View) */}
                            <td className="py-5 px-6 text-right pr-8">
                              <div className="flex items-center justify-end gap-2">
                                <a
                                  href={`/dashboard/bookings/${booking.id}`}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                                  title="View Booking Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>

                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button
                                      type="button"
                                      className="inline-flex items-center justify-center w-8 h-8 rounded-sm border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-2xs"
                                      title="Open Actions Menu"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent align="end" sideOffset={6} className="w-56 p-1.5 bg-white border border-gray-200 shadow-xl rounded-sm">
                                    <div className="px-2.5 py-1.5 border-b border-gray-100 mb-1">
                                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Booking Actions</p>
                                      <p className="text-xs font-semibold text-gray-800 truncate">{booking.eventType}</p>
                                    </div>

                                    {/* Action items based on state */}
                                    {isPending && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setAcceptBooking(bookingInfo);
                                            setQuotePrice('');
                                          }}
                                          className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-sm transition-colors text-left cursor-pointer"
                                        >
                                          <DollarSign className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                                          Accept & Quote Price
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setDeclineBooking(bookingInfo)}
                                          className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-sm transition-colors text-left cursor-pointer"
                                        >
                                          <XCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                                          Decline Booking
                                        </button>
                                      </>
                                    )}

                                    {isAwaitingPayment && (
                                      <>
                                        {isPendingCashRequest ? (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() => setApproveCashBooking(bookingInfo)}
                                              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 rounded-sm transition-colors text-left cursor-pointer"
                                            >
                                              <Banknote className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                                              Approve Cash Request
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setDeclineCashBooking(bookingInfo)}
                                              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-sm transition-colors text-left cursor-pointer"
                                            >
                                              <XCircle className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                                              Decline Cash Request
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button
                                              type="button"
                                              onClick={() => setReminderBooking(bookingInfo)}
                                              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50 rounded-sm transition-colors text-left cursor-pointer"
                                            >
                                              <Send className="w-3.5 h-3.5 shrink-0 text-primary" />
                                              Resend Payment Reminder
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => handleCopyCheckoutLink(booking.id)}
                                              className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50 rounded-sm transition-colors text-left cursor-pointer"
                                            >
                                              {copiedBookingId === booking.id ? (
                                                <Check className="w-3.5 h-3.5 shrink-0 text-green-600" />
                                              ) : (
                                                <Copy className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                                              )}
                                              Copy Checkout Link
                                            </button>
                                          </>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => setDeclineBooking(bookingInfo)}
                                          className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-sm transition-colors text-left cursor-pointer"
                                        >
                                          <XCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                                          Decline Booking
                                        </button>
                                      </>
                                    )}

                                    {isConfirmed && (
                                      <>
                                        {isApprovedCashRequest && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setCashPaidBooking(bookingInfo);
                                              setCashConfirmationText('');
                                            }}
                                            className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-sm transition-colors text-left cursor-pointer"
                                          >
                                            <Banknote className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                                            Mark Cash Received (Venue)
                                          </button>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => setCompleteEscrowBooking(bookingInfo)}
                                          className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded-sm transition-colors text-left cursor-pointer"
                                        >
                                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                                          Complete Gig & Release
                                        </button>
                                      </>
                                    )}

                                    <div className="border-t border-gray-100 mt-1 pt-1">
                                      <a
                                        href={`/dashboard/bookings/${booking.id}`}
                                        className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-sm transition-colors text-left cursor-pointer"
                                      >
                                        <Eye className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                                        View Full Details
                                      </a>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#787878]">
                          No bookings found for the selected filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* MODAL 1: Accept Booking & Enter Price Quote */}
      <Dialog open={!!acceptBooking} onOpenChange={(open) => !open && setAcceptBooking(null)}>
        <DialogContent className="sm:max-w-[450px] bg-white rounded-sm p-6 border border-gray-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Accept Booking Request
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 pt-1">
              Set your quote for this event. An official invoice with a secure online checkout link will be sent to{' '}
              <strong>{acceptBooking?.clientEmail}</strong>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConfirmAccept} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Total Price Quote ({acceptBooking?.currencyCode || 'KES'})
              </label>
              <Input
                type="number"
                min="1"
                step="any"
                placeholder="e.g. 50000"
                value={quotePrice}
                onChange={(e) => setQuotePrice(e.target.value)}
                required
                autoFocus
                className="h-10 rounded-sm"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAcceptBooking(null)}
                disabled={isUpdating}
                className="rounded-sm h-10 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating || !quotePrice}
                className="bg-primary hover:bg-primary/90 text-white rounded-sm h-10 px-5 font-bold"
              >
                {isUpdating ? 'Generating Invoice...' : 'Confirm & Accept'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Decline Booking Request with Note/Reason */}
      <DeclineBookingModal
        isOpen={!!declineBooking}
        clientName={declineBooking?.clientName}
        eventType={declineBooking?.eventType}
        isLoading={isUpdating}
        onClose={() => setDeclineBooking(null)}
        onConfirm={handleConfirmDecline}
      />

      {/* MODAL 3: Approve Cash Payment Request */}
      <ConfirmationDialog
        isOpen={!!approveCashBooking}
        title="Approve Cash on Event Day"
        description={
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              Are you sure you want to approve cash payment for <strong className="text-gray-900">{approveCashBooking?.clientName}</strong>?
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm text-amber-900 text-xs leading-relaxed">
              <strong>Notice:</strong> This will confirm the booking on your schedule. You agree to collect exact cash directly from the client at the venue.
            </div>
          </div>
        }
        confirmText="Approve Cash Payment"
        cancelText="Cancel"
        isLoading={handlingCash}
        onConfirm={handleConfirmApproveCash}
        onCancel={() => setApproveCashBooking(null)}
      />

      {/* MODAL 4: Decline Cash Request (Demand Online Pay) */}
      <ConfirmationDialog
        isOpen={!!declineCashBooking}
        title="Decline Cash Request"
        description={
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              Decline cash payment request for <strong className="text-gray-900">{declineCashBooking?.clientName}</strong>?
            </p>
            <p className="text-xs text-gray-500">
              The booking will remain awaiting payment, and the client will be emailed the official online payment link to pay via card or mobile money.
            </p>
          </div>
        }
        confirmText="Decline & Demand Online Pay"
        cancelText="Cancel"
        isLoading={handlingCash}
        onConfirm={handleConfirmDeclineCash}
        onCancel={() => setDeclineCashBooking(null)}
      />

      {/* MODAL 5: Complete Gig & Release Escrow */}
      <ConfirmationDialog
        isOpen={!!completeEscrowBooking}
        title="Complete Gig & Release Escrow"
        description={
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              Has the event for <strong className="text-gray-900">{completeEscrowBooking?.clientName}</strong> been successfully performed?
            </p>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm text-blue-900 text-xs leading-relaxed">
              Marking this event as completed will transition the booking to <strong>COMPLETED</strong> and release escrow funds directly to your wallet available balance.
            </div>
          </div>
        }
        confirmText="Complete & Release Funds"
        cancelText="Cancel"
        isLoading={isUpdating}
        onConfirm={handleConfirmCompleteEscrow}
        onCancel={() => setCompleteEscrowBooking(null)}
      />

      {/* MODAL 6: Confirm Cash Received at Venue (Requires typing PAID) */}
      <Dialog
        open={!!cashPaidBooking}
        onOpenChange={(open) => {
          if (!open) {
            setCashPaidBooking(null);
            setCashConfirmationText('');
          }
        }}
      >
        <DialogContent className="sm:max-w-[460px] bg-white rounded-sm p-6 border border-gray-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Confirm Cash Payment Received
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 pt-1">
              Confirm that you have received the exact cash from <strong>{cashPaidBooking?.clientName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm text-amber-900 text-sm leading-relaxed">
              <strong>Important:</strong> Marking this payment as received will immediately mark the invoice as <strong>PAID</strong> and transition this booking to <strong>COMPLETED</strong> status.
            </div>
            <p className="text-sm text-gray-600">
              To prevent accidental completion, please confirm by typing <span className="font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded-sm border">PAID</span> below:
            </p>
            <Input
              type="text"
              placeholder="Type PAID to confirm"
              value={cashConfirmationText}
              onChange={(e) => setCashConfirmationText(e.target.value)}
              className="h-10 rounded-sm text-center font-bold tracking-wider uppercase text-base"
              autoFocus
            />
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCashPaidBooking(null);
                  setCashConfirmationText('');
                }}
                disabled={isMarkingPaid}
                className="rounded-sm h-10 px-4"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirmMarkCashPaid}
                disabled={isMarkingPaid || cashConfirmationText.trim().toUpperCase() !== 'PAID'}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm h-10 px-5 font-bold shadow-xs disabled:opacity-50"
              >
                {isMarkingPaid ? 'Completing Booking...' : 'Confirm Cash Received'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL 7: Resend Payment Reminder Confirmation */}
      <ConfirmationDialog
        isOpen={!!reminderBooking}
        title="Send Payment Reminder"
        description={
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              Are you sure you want to resend the payment reminder email to{' '}
              <strong className="text-gray-900">{reminderBooking?.clientName}</strong> (
              <span className="text-gray-800 font-medium">{reminderBooking?.clientEmail}</span>)?
            </p>
            <p className="text-xs text-gray-500">
              This will send an official notification with the online checkout link so the client can complete payment.
            </p>
          </div>
        }
        confirmText="Send Reminder"
        cancelText="Cancel"
        isLoading={isSendingReminder}
        onConfirm={handleConfirmResendReminder}
        onCancel={() => setReminderBooking(null)}
      />
    </div>
  );
}
