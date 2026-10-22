/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@repo/ui';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import LoadingSpinner from '@/components/LoadingSpinner';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { DeclineBookingModal } from '@/components/DeclineBookingModal';
import {
  useGetBookingByIdQuery,
  useUpdateBookingStatusMutation,
  useConfirmDirectPaymentMutation,
  useRequestCompletionMutation,
  useConfirmCompletionMutation,
} from '@repo/store';

import { BookingHeader } from './_components/BookingHeader';
import { EventInfoCard } from './_components/EventInfoCard';
import { FinancialSummaryCard } from './_components/FinancialSummaryCard';
import { ActionCenterCard } from './_components/ActionCenterCard';
import { ClientInfoCard } from './_components/ClientInfoCard';
import { AcceptBookingModal } from './_components/AcceptBookingModal';
import { QuoteNegotiationCard } from '@/app/booking/manage/[bookingId]/_components/QuoteNegotiationCard';
import { BookingMessageThread } from '@/app/booking/manage/[bookingId]/_components/BookingMessageThread';

export default function BookingDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  // Data fetching
  const { data: bookingResponse, isLoading: loading, error: fetchError, refetch } = useGetBookingByIdQuery(id);
  const booking = bookingResponse?.data;
  const error = fetchError
    ? (fetchError as any).data?.message || (fetchError as any).message || 'Failed to fetch booking'
    : null;

  // Mutations
  const [updateStatus, { isLoading: updatingStatus }] = useUpdateBookingStatusMutation();
  const [confirmDirectPayment, { isLoading: confirmingPayment }] = useConfirmDirectPaymentMutation();
  const [requestCompletion, { isLoading: requestingCompletion }] = useRequestCompletionMutation();
  const [confirmCompletion, { isLoading: confirmingCompletion }] = useConfirmCompletionMutation();

  // Modals state
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [acceptAmountInput, setAcceptAmountInput] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isConfirmPaymentModalOpen, setIsConfirmPaymentModalOpen] = useState(false);
  const [isRequestCompletionModalOpen, setIsRequestCompletionModalOpen] = useState(false);
  const [isCompleteEventModalOpen, setIsCompleteEventModalOpen] = useState(false);

  const isActionLoading =
    updatingStatus || confirmingPayment || requestingCompletion || confirmingCompletion;

  const handleAcceptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(acceptAmountInput);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error(`Please enter a valid positive amount (${booking?.currencyCode || 'KES'})`);
      return;
    }
    try {
      await updateStatus({
        id,
        status: 'ACCEPTED',
        totalAmount: amountNum,
        currencyCode: booking?.currencyCode || 'KES',
      }).unwrap();
      toast.success('Booking accepted! Client has been emailed your quotation.');
      setIsAcceptModalOpen(false);
      setAcceptAmountInput('');
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to accept booking');
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    try {
      await updateStatus({
        id,
        status: 'REJECTED',
        reason: reason.trim(),
      }).unwrap();
      toast.success('Booking declined and reason emailed to client');
      setIsRejectModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to decline booking');
    }
  };

  const handleConfirmDirectPaymentReceived = async () => {
    try {
      await confirmDirectPayment(id).unwrap();
      toast.success('Direct payment marked as received in your records.');
      setIsConfirmPaymentModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to confirm direct payment');
    }
  };

  const handleSendRequestCompletion = async () => {
    try {
      await requestCompletion(id).unwrap();
      toast.success('Completion confirmation requested from client.');
      setIsRequestCompletionModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to request completion');
    }
  };

  const handleConfirmCompleteEvent = async () => {
    try {
      await confirmCompletion(id).unwrap();
      toast.success('Event marked as completed!');
      setIsCompleteEventModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to complete event');
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <Link href="/dashboard/bookings">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <div className="p-6 bg-red-50/80 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3 shadow-sm">
          Error: {error || 'Booking not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto w-full space-y-6">
      {/* Top Header */}
      <BookingHeader
        booking={booking}
        downloading={false}
        onDownloadInvoice={() => {}}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Negotiation, Event & Financial Information */}
        <div className="lg:col-span-2 space-y-6">
          <QuoteNegotiationCard
            booking={booking}
            currencyCode={booking.currencyCode || 'KES'}
            quotes={(booking as any).quotes || []}
            agreement={(booking as any).agreement}
            viewerRole="DJ"
            clientName={booking.client?.name || 'Client'}
            clientEmail={booking.client?.email}
            djStageName={(booking as any).tenant?.stageName || (booking as any).dj?.user?.name || (booking as any).dj?.stageName || 'DJ'}
            djEmail={(booking as any).tenant?.user?.email || (booking as any).dj?.user?.email}
            onQuoteUpdated={refetch}
          />
          <EventInfoCard booking={booking} />
          <FinancialSummaryCard booking={booking} />
          <BookingMessageThread
            bookingId={booking.id}
            messages={(booking as any).messages || []}
            clientName={booking.client?.name || 'Client'}
            clientEmail={booking.client?.email}
            djStageName={(booking as any).tenant?.stageName || (booking as any).dj?.user?.name || (booking as any).dj?.stageName || 'DJ'}
            djEmail={(booking as any).tenant?.user?.email || (booking as any).dj?.user?.email}
            viewerRole="DJ"
            onMessageSent={refetch}
          />
        </div>

        {/* Right Column: Actions & Client Information */}
        <div className="space-y-6">
          <ActionCenterCard
            booking={booking}
            isActionLoading={isActionLoading}
            onOpenAcceptModal={() => setIsAcceptModalOpen(true)}
            onOpenRejectModal={() => setIsRejectModalOpen(true)}
            onConfirmDirectPayment={() => setIsConfirmPaymentModalOpen(true)}
            onRequestCompletion={() => setIsRequestCompletionModalOpen(true)}
            onCompleteEvent={() => setIsCompleteEventModalOpen(true)}
          />

          <ClientInfoCard booking={booking} />
        </div>
      </div>

      {/* Modals & Dialogs */}
      <AcceptBookingModal
        isOpen={isAcceptModalOpen}
        onOpenChange={setIsAcceptModalOpen}
        booking={booking}
        amountInput={acceptAmountInput}
        onAmountInputChange={setAcceptAmountInput}
        onSubmit={handleAcceptSubmit}
        isLoading={updatingStatus}
      />

      <DeclineBookingModal
        isOpen={isRejectModalOpen}
        clientName={booking.client?.name || 'Client'}
        eventType={booking.eventType || 'Event'}
        isLoading={updatingStatus}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
      />

      {/* Confirm Direct Payment Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmPaymentModalOpen}
        title="Mark Direct Payment Received"
        description={
          <div className="space-y-2.5 text-sm text-gray-600">
            <p>
              Confirm that you have received direct payment outside the platform from{' '}
              <strong className="text-gray-900">{booking.client?.name || 'the client'}</strong>?
            </p>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs leading-relaxed">
              <strong>Record Keeping:</strong> This updates the settlement status to <strong>Payment Confirmed</strong> in your records. All direct settlements (cash, wire, or mobile money) are arranged directly between you and the client.
            </div>
          </div>
        }
        confirmText="Mark Payment as Received"
        cancelText="Cancel"
        confirmButtonClassName="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
        isLoading={confirmingPayment}
        onConfirm={handleConfirmDirectPaymentReceived}
        onCancel={() => setIsConfirmPaymentModalOpen(false)}
      />

      {/* Request Completion Dialog */}
      <ConfirmationDialog
        isOpen={isRequestCompletionModalOpen}
        title="Request Client Completion Confirmation"
        description={
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              Send an email request to{' '}
              <strong className="text-gray-900">{booking.client?.name || 'the client'}</strong> asking them to confirm that the performance has concluded and leave a review?
            </p>
          </div>
        }
        confirmText="Send Request"
        cancelText="Cancel"
        confirmButtonClassName="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
        isLoading={requestingCompletion}
        onConfirm={handleSendRequestCompletion}
        onCancel={() => setIsRequestCompletionModalOpen(false)}
      />

      {/* Mark Completed Dialog */}
      <ConfirmationDialog
        isOpen={isCompleteEventModalOpen}
        title="Mark Gig Completed"
        description={
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              Has the performance for{' '}
              <strong className="text-gray-900">{booking.client?.name || 'the client'}</strong> concluded?
            </p>
            <p className="text-xs text-gray-500">
              The booking status will update to <strong>COMPLETED</strong> and the client will be invited to leave a review.
            </p>
          </div>
        }
        confirmText="Mark Completed"
        cancelText="Cancel"
        confirmButtonClassName="bg-[#111827] hover:bg-black"
        isLoading={confirmingCompletion}
        onConfirm={handleConfirmCompleteEvent}
        onCancel={() => setIsCompleteEventModalOpen(false)}
      />
    </div>
  );
}
