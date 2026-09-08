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
  useDownloadInvoicePdfMutation,
  useUpdateBookingStatusMutation,
  useHandleCashRequestDecisionMutation,
  useMarkCashAsPaidMutation,
  useResendPaymentReminderMutation,
} from '@repo/store';

import { BookingHeader } from './_components/BookingHeader';
import { EventInfoCard } from './_components/EventInfoCard';
import { FinancialSummaryCard } from './_components/FinancialSummaryCard';
import { ActionCenterCard } from './_components/ActionCenterCard';
import { ClientInfoCard } from './_components/ClientInfoCard';
import { AcceptBookingModal } from './_components/AcceptBookingModal';
import { ConfirmCashPaymentModal } from './_components/ConfirmCashPaymentModal';

export default function BookingDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  // Data fetching
  const { data: bookingResponse, isLoading: loading, error: fetchError } = useGetBookingByIdQuery(id);
  const booking = bookingResponse?.data;
  const error = fetchError
    ? (fetchError as any).data?.message || (fetchError as any).message || 'Failed to fetch booking'
    : null;

  // Mutations
  const [downloadInvoicePdf, { isLoading: downloading }] = useDownloadInvoicePdfMutation();
  const [updateStatus, { isLoading: updatingStatus }] = useUpdateBookingStatusMutation();
  const [handleCash, { isLoading: handlingCash }] = useHandleCashRequestDecisionMutation();
  const [markPaid, { isLoading: markingPaid }] = useMarkCashAsPaidMutation();
  const [resendReminder, { isLoading: isSendingReminder }] = useResendPaymentReminderMutation();

  // Modals state
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [acceptAmountInput, setAcceptAmountInput] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isCashConfirmModalOpen, setIsCashConfirmModalOpen] = useState(false);
  const [cashConfirmationText, setCashConfirmationText] = useState('');
  const [isApproveCashModalOpen, setIsApproveCashModalOpen] = useState(false);
  const [isRejectCashModalOpen, setIsRejectCashModalOpen] = useState(false);
  const [isCompleteEventModalOpen, setIsCompleteEventModalOpen] = useState(false);
  const [isResendReminderModalOpen, setIsResendReminderModalOpen] = useState(false);

  const isActionLoading = updatingStatus || handlingCash || markingPaid;

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const blob = await downloadInvoicePdf(invoiceId).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Invoice downloaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Could not download invoice. Please try again.');
    }
  };

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
        status: 'AWAITING_PAYMENT',
        totalAmount: amountNum,
        currencyCode: booking?.currencyCode || 'KES'
      }).unwrap();
      toast.success('Booking accepted! Client has been emailed the payment checkout link.');
      setIsAcceptModalOpen(false);
      setAcceptAmountInput('');
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
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to decline booking');
    }
  };

  const handleConfirmResendReminder = async () => {
    try {
      await resendReminder(id).unwrap();
      toast.success('Payment reminder email sent to client successfully!');
      setIsResendReminderModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to send payment reminder');
    }
  };

  const handleConfirmApproveCash = async () => {
    try {
      await handleCash({ id, decision: 'approve' }).unwrap();
      toast.success('Cash payment approved! Client has been emailed event confirmation.');
      setIsApproveCashModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to approve cash request');
    }
  };

  const handleConfirmRejectCash = async () => {
    try {
      await handleCash({ id, decision: 'reject' }).unwrap();
      toast.success('Cash request declined. Client has been emailed online checkout link.');
      setIsRejectCashModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to decline cash request');
    }
  };

  const handleConfirmCompleteEvent = async () => {
    try {
      await updateStatus({ id, status: 'COMPLETED' }).unwrap();
      toast.success('Event marked as completed! Funds released to wallet.');
      setIsCompleteEventModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to complete event');
    }
  };

  const handleCashPaidConfirm = async () => {
    if (cashConfirmationText.trim().toUpperCase() !== 'PAID') {
      toast.error('Please type PAID to confirm');
      return;
    }
    try {
      await markPaid(id).unwrap();
      toast.success('Payment marked as paid via Cash and booking completed!');
      setIsCashConfirmModalOpen(false);
      setCashConfirmationText('');
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to mark payment as paid');
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
        downloading={downloading}
        onDownloadInvoice={handleDownloadInvoice}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Event & Financial Information */}
        <div className="lg:col-span-2 space-y-6">
          <EventInfoCard booking={booking} />
          <FinancialSummaryCard booking={booking} />
        </div>

        {/* Right Column: Actions & Client Information */}
        <div className="space-y-6">
          <ActionCenterCard
            booking={booking}
            isActionLoading={isActionLoading}
            onOpenAcceptModal={() => setIsAcceptModalOpen(true)}
            onOpenRejectModal={() => setIsRejectModalOpen(true)}
            onApproveCash={() => setIsApproveCashModalOpen(true)}
            onRejectCash={() => setIsRejectCashModalOpen(true)}
            onOpenCashConfirmModal={() => setIsCashConfirmModalOpen(true)}
            onCompleteEvent={() => setIsCompleteEventModalOpen(true)}
            onResendReminder={async () => setIsResendReminderModalOpen(true)}
            isReminderLoading={isSendingReminder}
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

      {/* Confirm Approve Cash */}
      <ConfirmationDialog
        isOpen={isApproveCashModalOpen}
        title="Approve Cash on Event Day"
        description={
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              Are you sure you want to approve cash payment for <strong className="text-gray-900">{booking.client?.name || 'the client'}</strong>?
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs leading-relaxed">
              <strong>Notice:</strong> This will confirm the booking on your schedule. You agree to collect exact cash directly from the client at the venue.
            </div>
          </div>
        }
        confirmText="Approve Cash Payment"
        cancelText="Cancel"
        confirmButtonClassName="bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-500/20"
        isLoading={handlingCash}
        onConfirm={handleConfirmApproveCash}
        onCancel={() => setIsApproveCashModalOpen(false)}
      />

      {/* Confirm Decline Cash */}
      <ConfirmationDialog
        isOpen={isRejectCashModalOpen}
        title="Decline Cash Request"
        description={
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              Decline cash payment request for <strong className="text-gray-900">{booking.client?.name || 'the client'}</strong>?
            </p>
            <p className="text-xs text-gray-500">
              The booking will remain awaiting payment, and the client will be sent the official online payment link to pay via card or mobile money.
            </p>
          </div>
        }
        confirmText="Decline & Demand Online Pay"
        cancelText="Cancel"
        isLoading={handlingCash}
        onConfirm={handleConfirmRejectCash}
        onCancel={() => setIsRejectCashModalOpen(false)}
      />

      {/* Confirm Complete Event & Escrow Release */}
      <ConfirmationDialog
        isOpen={isCompleteEventModalOpen}
        title="Complete Gig & Release Escrow"
        description={
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              Has the event for <strong className="text-gray-900">{booking.client?.name || 'the client'}</strong> been successfully completed?
            </p>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs leading-relaxed">
              Marking this event as completed will transition the booking to <strong>COMPLETED</strong> and release escrow funds directly to your wallet available balance.
            </div>
          </div>
        }
        confirmText="Complete & Release Funds"
        cancelText="Cancel"
        confirmButtonClassName="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
        isLoading={updatingStatus}
        onConfirm={handleConfirmCompleteEvent}
        onCancel={() => setIsCompleteEventModalOpen(false)}
      />

      {/* Confirm Resend Payment Reminder */}
      <ConfirmationDialog
        isOpen={isResendReminderModalOpen}
        title="Send Payment Reminder"
        description={
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              Are you sure you want to resend the payment reminder email to{' '}
              <strong className="text-gray-900">{booking.client?.name || 'the client'}</strong> (
              <span className="text-gray-800 font-medium">{booking.client?.email}</span>)?
            </p>
            <p className="text-xs text-gray-500">
              This will email an invoice and direct payment checkout link to the client.
            </p>
          </div>
        }
        confirmText="Send Reminder"
        cancelText="Cancel"
        isLoading={isSendingReminder}
        onConfirm={handleConfirmResendReminder}
        onCancel={() => setIsResendReminderModalOpen(false)}
      />

      <ConfirmCashPaymentModal
        isOpen={isCashConfirmModalOpen}
        onOpenChange={setIsCashConfirmModalOpen}
        confirmationText={cashConfirmationText}
        onConfirmationTextChange={setCashConfirmationText}
        onConfirm={handleCashPaidConfirm}
        isLoading={markingPaid}
      />
    </div>
  );
}
