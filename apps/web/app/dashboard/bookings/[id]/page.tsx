'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@repo/ui';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import LoadingSpinner from '@/components/LoadingSpinner';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import {
  useGetBookingByIdQuery,
  useDownloadInvoicePdfMutation,
  useUpdateBookingStatusMutation,
  useHandleCashRequestDecisionMutation,
  useMarkCashAsPaidMutation,
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

  // Modals state
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [acceptAmountInput, setAcceptAmountInput] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isCashConfirmModalOpen, setIsCashConfirmModalOpen] = useState(false);
  const [cashConfirmationText, setCashConfirmationText] = useState('');

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
      toast.error('Please enter a valid positive amount (KES)');
      return;
    }
    try {
      await updateStatus({ id, status: 'accepted' as any, totalAmount: amountNum }).unwrap();
      toast.success('Booking accepted successfully! Invoice payment link generated.');
      setIsAcceptModalOpen(false);
      setAcceptAmountInput('');
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to accept booking');
    }
  };

  const handleRejectConfirm = async () => {
    try {
      await updateStatus({ id, status: 'rejected' as any }).unwrap();
      toast.success('Booking rejected successfully');
      setIsRejectModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to reject booking');
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
            onApproveCash={() => handleCash({ id, decision: 'approve' })}
            onRejectCash={() => handleCash({ id, decision: 'reject' })}
            onOpenCashConfirmModal={() => setIsCashConfirmModalOpen(true)}
            onCompleteEvent={() => updateStatus({ id, status: 'completed' as any })}
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

      <ConfirmationDialog
        isOpen={isRejectModalOpen}
        title="Reject Booking Request"
        description="Are you sure you want to reject this booking request? The client will be notified and the reservation will be canceled."
        confirmText="Reject Booking"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={updatingStatus}
        onConfirm={handleRejectConfirm}
        onCancel={() => setIsRejectModalOpen(false)}
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
