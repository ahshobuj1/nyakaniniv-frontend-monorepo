/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {useState, useEffect} from 'react';
import {
  AlertCircle,
  Calendar,
  Eye,
  MoreVertical,
  DollarSign,
  XCircle,
  Banknote,
  Copy,
  Check,
  CheckCircle2,
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
  ListHeaderControls,
  PaginationControls,
} from '@repo/ui';
import {
  useGetMyBookingsQuery,
  useUpdateBookingStatusMutation,
  useConfirmDirectPaymentMutation,
  useConfirmCompletionMutation,
  useGetCurrentProfileQuery,
} from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import {ConfirmationDialog} from '@/components/ConfirmationDialog';
import {DeclineBookingModal} from '@/components/DeclineBookingModal';
import {
  normalizeBookingStatus,
  getBookingStatusBadge,
  getDirectPaymentStatusBadge,
} from '@/lib/bookingStatusHelper';
import {BookingStatusBadge} from '@/components/BookingStatusBadge';
import {
  formatDateInTz,
  formatTimeInTz,
  getBrowserTimezone,
} from '@/lib/timezone';
import {toast} from 'sonner';
import Link from 'next/link';

type FilterType =
  | 'All'
  | 'pending'
  | 'accepted'
  | 'confirmed'
  | 'completed'
  | 'disputed'
  | 'canceled';

interface ActiveBooking {
  id: string;
  orderReference?: string;
  clientName: string;
  clientEmail: string;
  eventType: string;
  currencyCode: string;
  totalAmount?: number | null;
}

export default function BookingsPage() {
  const [filter, setFilter] = useState<FilterType>('All');
  const [copiedBookingId, setCopiedBookingId] = useState<string | null>(null);

  // Search, Sort & Pagination State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({...prev, pageIndex: 0}));
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSort = (value: string) => {
    setSort(value);
    setPagination((prev) => ({...prev, pageIndex: 0}));
  };
  const handleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPagination((prev) => ({...prev, pageIndex: 0}));
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setPagination((prev) => ({...prev, pageIndex: 0}));
  };

  const sortOptions = [
    {value: 'createdAt', label: 'Booking Date'},
    {value: 'eventDate', label: 'Event Date'},
    {value: 'totalAmount', label: 'Amount'},
    {value: 'clientName', label: 'Client Name'},
  ];

  const queryParams: Record<string, any> = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  };
  if (debouncedSearch.trim()) queryParams.search = debouncedSearch.trim();
  if (sort) queryParams.sortBy = sort;
  if (sortOrder) queryParams.sortOrder = sortOrder;
  if (filter !== 'All') queryParams.status = filter;

  // APIs
  const {
    data: bookingsResponse,
    isLoading: isBookingsLoading,
    refetch,
  } = useGetMyBookingsQuery(queryParams);
  const {data: profileResponse} = useGetCurrentProfileQuery();
  const djTimezone =
    profileResponse?.data?.tenant?.timezone || getBrowserTimezone();
  const [updateStatus, {isLoading: isUpdating}] =
    useUpdateBookingStatusMutation();
  const [confirmDirectPayment, {isLoading: isConfirmingPayment}] =
    useConfirmDirectPaymentMutation();
  const [confirmCompletion, {isLoading: isCompleting}] =
    useConfirmCompletionMutation();

  // Modals State
  const [acceptBooking, setAcceptBooking] = useState<ActiveBooking | null>(
    null,
  );
  const [quotePrice, setQuotePrice] = useState('');
  const [declineBooking, setDeclineBooking] = useState<ActiveBooking | null>(
    null,
  );
  const [confirmPaymentBooking, setConfirmPaymentBooking] =
    useState<ActiveBooking | null>(null);
  const [completeBooking, setCompleteBooking] = useState<ActiveBooking | null>(
    null,
  );

  const bookings = bookingsResponse?.data || [];
  const meta =
    bookingsResponse?.meta?.pagination || bookingsResponse?.meta || {};
  const totalRows = meta?.total || bookings.length;
  const totalPages =
    meta?.totalPages || Math.ceil(totalRows / pagination.pageSize);

  const pendingCount = bookings.filter(
    (b: any) => normalizeBookingStatus(b.status) === 'PENDING',
  ).length;

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
        status: 'ACCEPTED',
        totalAmount: amountNum,
        currencyCode: acceptBooking.currencyCode || 'KES',
      }).unwrap();
      toast.success(
        'Booking accepted! Client has been emailed your quotation.',
      );
      setAcceptBooking(null);
      setQuotePrice('');
      refetch();
    } catch (error: any) {
      toast.error(
        error?.data?.error?.message ||
          error?.data?.message ||
          'Failed to accept booking',
      );
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
      refetch();
    } catch (error: any) {
      toast.error(
        error?.data?.error?.message ||
          error?.data?.message ||
          'Failed to decline booking',
      );
    }
  };

  const handleConfirmDirectPayment = async () => {
    if (!confirmPaymentBooking) return;
    try {
      await confirmDirectPayment(confirmPaymentBooking.id).unwrap();
      toast.success('Direct payment marked as received in your records.');
      setConfirmPaymentBooking(null);
      refetch();
    } catch (error: any) {
      toast.error(
        error?.data?.error?.message ||
          error?.data?.message ||
          'Failed to confirm direct payment',
      );
    }
  };

  const handleConfirmCompleteGig = async () => {
    if (!completeBooking) return;
    try {
      await confirmCompletion(completeBooking.id).unwrap();
      toast.success(
        'Gig marked as completed! Client has been invited to leave a review.',
      );
      setCompleteBooking(null);
      refetch();
    } catch (error: any) {
      toast.error(
        error?.data?.error?.message ||
          error?.data?.message ||
          'Failed to complete gig',
      );
    }
  };

  const handleCopyPortalLink = (booking: any) => {
    const orderRef =
      booking.orderReference || `UB-${booking.id.slice(0, 8).toUpperCase()}`;
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/booking/manage/${booking.id}?ref=${orderRef}`
        : `https://upbeat.africa/booking/manage/${booking.id}?ref=${orderRef}`;
    navigator.clipboard.writeText(url);
    setCopiedBookingId(booking.id);
    toast.success('Client booking portal link copied to clipboard!');
    setTimeout(() => setCopiedBookingId(null), 2000);
  };

  const statusFilterOptions = [
    {value: 'All', label: 'All Statuses'},
    {value: 'pending', label: 'Pending Review'},
    {value: 'accepted', label: 'Accepted'},
    {value: 'confirmed', label: 'Confirmed'},
    {value: 'completed', label: 'Completed'},
    {value: 'disputed', label: 'Issue Reported'},
    {value: 'canceled', label: 'Cancelled'},
  ];

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen p-4 md:p-2 font-sans">
      <div className="mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        {/* <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Bookings</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Review and manage your performance inquiries, client agreements,
              and invoices.
            </p>
          </div>

          <Link
            href="/dashboard/schedule"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold rounded-xl border border-gray-200 shadow-2xs transition-colors cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Open Schedule View &rarr;</span>
          </Link>
        </div> */}

        <ListHeaderControls
          title="All Booking Inquiries"
          description="Review quotation requests, accept bookings, and manage schedule."
          search={search}
          setSearch={setSearch}
          searchPlaceholder="Search event type or address..."
          filter={filter}
          onFilter={(v) => handleFilterChange(v as FilterType)}
          filterOptions={statusFilterOptions}
          filterPlaceholder="All Statuses"
          sort={sort}
          onSort={handleSort}
          sortOrder={sortOrder}
          onSortOrder={handleSortOrder}
          sortOptions={sortOptions}
        />

        {/* Alert Banner */}
        {pendingCount > 0 && (
          <div className="bg-[#FFF8E6] border border-[#FDE68A] rounded-sm p-4 flex items-center gap-3 text-[#D97706]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-xs sm:text-sm font-medium">
              You have{' '}
              <span className="font-bold">
                {pendingCount} pending booking{' '}
                {pendingCount === 1 ? 'request' : 'requests'}
              </span>{' '}
              awaiting your review and quotation.
            </p>
          </div>
        )}

        {/* Table Card */}
        {isBookingsLoading ? (
          <LoadingSpinner />
        ) : (
          <Card className="border border-gray-200 shadow-xs overflow-hidden rounded-sm bg-white">
            <CardContent className="p-0">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#111620]">
                  Bookings List
                </h2>
                <span className="text-xs text-gray-500 font-medium">
                  Showing {bookings.length}{' '}
                  {bookings.length === 1 ? 'booking' : 'bookings'}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-225 text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="py-4 px-6 text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Ref & Client
                      </th>
                      <th className="py-4 px-6 text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Event Type
                      </th>
                      <th className="py-4 px-6 text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Event Date
                      </th>
                      <th className="py-4 px-6 text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="py-4 px-6 text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Booking Status
                      </th>
                      <th className="py-4 px-6 text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider text-right pr-8">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.length > 0 ? (
                      bookings.map((booking: any) => {
                        const status = normalizeBookingStatus(booking.status);
                        const isPending = status === 'PENDING';
                        const isAccepted =
                          status === 'ACCEPTED' ||
                          status === 'AWAITING_PAYMENT';
                        const isConfirmed = status === 'CONFIRMED';
                        const badge = getBookingStatusBadge(
                          booking.status,
                          booking.eventDate,
                        );
                        const directBadge = getDirectPaymentStatusBadge(
                          booking.directPaymentStatus,
                        );

                        const agreement = booking.agreement;
                        const hasAgreement = Boolean(agreement);
                        const latestQuote = booking.quotes?.[0];
                        const isNegotiating =
                          !hasAgreement &&
                          Boolean(
                            latestQuote && latestQuote.status === 'PROPOSED',
                          );
                        const isClientCounteroffer =
                          isNegotiating && latestQuote?.proposedBy === 'CLIENT';
                        const isDjQuotePendingClient =
                          isNegotiating && latestQuote?.proposedBy === 'DJ';

                        const bookingInfo: ActiveBooking = {
                          id: booking.id,
                          orderReference: booking.orderReference,
                          clientName: booking.client?.name || 'Client',
                          clientEmail: booking.client?.email || '',
                          eventType: booking.eventType || 'Event',
                          currencyCode: booking.currencyCode || 'KES',
                          totalAmount: booking.totalAmount,
                        };

                        const tz = djTimezone;
                        const isDifferentTz =
                          booking.eventTimezone &&
                          booking.eventTimezone !== djTimezone;
                        const dateFormatted = booking.eventDate
                          ? formatDateInTz(booking.eventDate, tz, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Date TBD';
                        const timeFormatted = booking.eventDate
                          ? formatTimeInTz(booking.eventDate, tz)
                          : '';

                        return (
                          <tr
                            key={booking.id}
                            className="hover:bg-gray-50/50 transition-colors">
                            {/* Ref & Client */}
                            <td className="py-5 px-6">
                              <div className="flex flex-col">
                                <span className="font-mono text-xs font-bold text-primary">
                                  {booking.orderReference ||
                                    `UB-${booking.id.slice(0, 8).toUpperCase()}`}
                                </span>
                                <span className="font-semibold text-gray-900 text-xs mt-0.5">
                                  {booking.client?.name || 'Client'}
                                </span>
                                {booking.client?.email && (
                                  <span className="text-[11px] text-gray-400">
                                    {booking.client.email}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Event Type */}
                            <td className="py-5 px-6">
                              <span className="text-xs font-semibold text-gray-800">
                                {booking.eventType || 'Performance'}
                              </span>
                              {booking.address && (
                                <span className="text-[11px] text-gray-400 block line-clamp-1">
                                  {booking.address}
                                </span>
                              )}
                            </td>

                            {/* Event Date */}
                            <td className="py-5 px-6">
                              <div className="flex flex-col gap-1 text-xs">
                                <div className="flex items-center gap-1.5 font-medium text-gray-800">
                                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                  {dateFormatted}
                                </div>
                                {timeFormatted && (
                                  <div className="text-[10px] font-mono text-gray-600">
                                    <span>{timeFormatted}</span>
                                    {isDifferentTz && (
                                      <span className="text-gray-400 block font-sans text-[9px]">
                                        Client:{' '}
                                        {formatTimeInTz(
                                          booking.eventDate,
                                          booking.eventTimezone,
                                        )}{' '}
                                        ({booking.eventTimezone})
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Amount & Payment Status */}
                            <td className="py-5 px-6">
                              <div className="flex flex-col items-start gap-1">
                                <span className="font-bold font-mono text-xs text-gray-900">
                                  {hasAgreement ? (
                                    <MoneyDisplay
                                      amount={Number(
                                        agreement.agreedAmount ||
                                          booking.totalAmount,
                                      )}
                                      currencyCode={
                                        agreement.currency ||
                                        booking.currencyCode ||
                                        'KES'
                                      }
                                    />
                                  ) : latestQuote ? (
                                    <MoneyDisplay
                                      amount={Number(
                                        latestQuote.amount ||
                                          booking.totalAmount,
                                      )}
                                      currencyCode={
                                        latestQuote.currency ||
                                        booking.currencyCode ||
                                        'KES'
                                      }
                                    />
                                  ) : booking.totalAmount ? (
                                    <MoneyDisplay
                                      amount={booking.totalAmount}
                                      currencyCode={
                                        booking.currencyCode || 'KES'
                                      }
                                    />
                                  ) : (
                                    <span className="text-gray-400 font-normal italic text-[11px]">
                                      Quote Pending
                                    </span>
                                  )}
                                </span>

                                {/* Negotiation / Settlement Badge */}
                                {isClientCounteroffer ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-sm bg-rose-50 text-rose-700 border border-rose-300 font-bold animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-sm bg-rose-500" />
                                    Client Counteroffer
                                  </span>
                                ) : isDjQuotePendingClient ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                                    Quote Sent (Waiting)
                                  </span>
                                ) : hasAgreement ? (
                                  <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${directBadge.badgeClass}`}>
                                    {directBadge.label}
                                  </span>
                                ) : isPending ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    Needs Quote
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 font-medium">
                                    In Negotiation
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Booking Status */}
                            <td className="py-5 px-6">
                              <BookingStatusBadge
                                status={booking.status}
                                label={badge.label}
                              />
                            </td>

                            {/* Actions Column */}
                            <td className="py-5 px-6 text-right pr-8">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  href={`/dashboard/bookings/${booking.id}`}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                  title="View Booking Details">
                                  <Eye className="w-4 h-4" />
                                </Link>

                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button
                                      type="button"
                                      className="inline-flex items-center justify-center w-8 h-8 rounded-sm border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                                      title="Actions">
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    align="end"
                                    sideOffset={6}
                                    className="w-56 p-1.5 bg-white border border-gray-200 shadow-xl rounded-sm">
                                    <div className="px-2.5 py-1.5 border-b border-gray-100 mb-1">
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        Booking Actions
                                      </p>
                                      <p className="text-xs font-semibold text-gray-800 truncate">
                                        {booking.eventType}
                                      </p>
                                    </div>

                                    {isPending && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setAcceptBooking(bookingInfo);
                                            setQuotePrice('');
                                          }}
                                          className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-sm text-left cursor-pointer">
                                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                                          Accept & Propose Quote
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setDeclineBooking(bookingInfo)
                                          }
                                          className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-sm text-left cursor-pointer">
                                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                          Decline Booking
                                        </button>
                                      </>
                                    )}

                                    {isAccepted && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setConfirmPaymentBooking(
                                              bookingInfo,
                                            )
                                          }
                                          className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-sm text-left cursor-pointer">
                                          <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                                          Confirm Direct Payment
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleCopyPortalLink(booking)
                                          }
                                          className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-sm text-left cursor-pointer">
                                          {copiedBookingId === booking.id ? (
                                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                                          ) : (
                                            <Copy className="w-3.5 h-3.5 text-gray-400" />
                                          )}
                                          Copy Client Portal Link
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setDeclineBooking(bookingInfo)
                                          }
                                          className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-sm text-left cursor-pointer">
                                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                          Decline Booking
                                        </button>
                                      </>
                                    )}

                                    {isConfirmed && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setCompleteBooking(bookingInfo)
                                          }
                                          className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded-sm text-left cursor-pointer">
                                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                                          Mark Gig Completed
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleCopyPortalLink(booking)
                                          }
                                          className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-sm text-left cursor-pointer">
                                          <Copy className="w-3.5 h-3.5 text-gray-400" />
                                          Copy Client Portal Link
                                        </button>
                                      </>
                                    )}

                                    <div className="border-t border-gray-100 mt-1 pt-1">
                                      <Link
                                        href={`/dashboard/bookings/${booking.id}`}
                                        className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-sm text-left">
                                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                                        View Full Details
                                      </Link>
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
                        <td
                          colSpan={6}
                          className="py-12 text-center text-gray-400 text-xs">
                          No bookings found for the selected filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalRows > 10 && (
                <div className="border-t border-gray-100 bg-white">
                  <PaginationControls
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    totalPages={totalPages}
                    totalRows={totalRows}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Accept & Quote Modal */}
      <Dialog
        open={!!acceptBooking}
        onOpenChange={(open) => !open && setAcceptBooking(null)}>
        <DialogContent className="sm:max-w-[460px] bg-white rounded-sm p-6 border border-gray-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Accept Booking Request
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-600 pt-1">
              Propose your performance fee quote for{' '}
              <strong>{acceptBooking?.clientName}</strong>. The client will be
              notified immediately to review your quotation and event details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConfirmAccept} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Proposed Performance Fee ({acceptBooking?.currencyCode || 'KES'}
                )
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
                className="rounded-sm h-10 px-4 text-xs font-semibold">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating || !quotePrice}
                className="bg-primary hover:bg-primary/90 text-white rounded-sm h-10 px-5 text-xs font-bold">
                {isUpdating ? 'Accepting...' : 'Confirm & Accept'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Decline Booking Modal */}
      <DeclineBookingModal
        isOpen={!!declineBooking}
        clientName={declineBooking?.clientName}
        eventType={declineBooking?.eventType}
        isLoading={isUpdating}
        onClose={() => setDeclineBooking(null)}
        onConfirm={handleConfirmDecline}
      />

      {/* Confirm Direct Payment Dialog */}
      <ConfirmationDialog
        isOpen={!!confirmPaymentBooking}
        title="Mark Direct Payment Received"
        description={
          <div className="space-y-2 text-xs text-gray-600">
            <p>
              Confirm that you have received direct payment outside the platform
              from{' '}
              <strong className="text-gray-900">
                {confirmPaymentBooking?.clientName}
              </strong>
              ?
            </p>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm text-emerald-900 leading-relaxed">
              <strong>Record Keeping:</strong> This updates the settlement
              status to <strong>Payment Confirmed</strong> in your records. All
              direct settlements are arranged directly between you and the
              client.
            </div>
          </div>
        }
        confirmText="Mark Payment as Received"
        cancelText="Cancel"
        confirmButtonClassName="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold"
        isLoading={isConfirmingPayment}
        onConfirm={handleConfirmDirectPayment}
        onCancel={() => setConfirmPaymentBooking(null)}
      />

      {/* Complete Gig Dialog */}
      <ConfirmationDialog
        isOpen={!!completeBooking}
        title="Mark Gig Completed"
        description={
          <div className="space-y-2 text-xs text-gray-600">
            <p>
              Has the event performance for{' '}
              <strong className="text-gray-900">
                {completeBooking?.clientName}
              </strong>{' '}
              concluded?
            </p>
            <p className="text-gray-500">
              The booking will transition to <strong>COMPLETED</strong> and the
              client will be invited to leave a review.
            </p>
          </div>
        }
        confirmText="Mark Gig Completed"
        cancelText="Cancel"
        confirmButtonClassName="bg-blue-600 hover:bg-blue-700 text-xs font-bold"
        isLoading={isCompleting}
        onConfirm={handleConfirmCompleteGig}
        onCancel={() => setCompleteBooking(null)}
      />
    </div>
  );
}
