'use client';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { CheckCircle2, Clock } from 'lucide-react';
import { Booking } from '@repo/store';

interface ActionCenterCardProps {
  booking: Booking;
  isActionLoading: boolean;
  onOpenAcceptModal: () => void;
  onOpenRejectModal: () => void;
  onApproveCash: () => void;
  onRejectCash: () => void;
  onOpenCashConfirmModal: () => void;
  onCompleteEvent: () => void;
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
}: ActionCenterCardProps) {
  const isCompleted = booking.status === 'completed';
  const cashTransaction = booking.invoice?.transactions?.find(
    (tx: any) => tx.gateway === 'CASH' || tx.gateway === 'MANUAL'
  );
  const isPendingCashRequest =
    cashTransaction?.status === 'PENDING' && !cashTransaction?.metadata?.cashApproved;
  const isApprovedCashRequest =
    cashTransaction?.status === 'PENDING' && Boolean(cashTransaction?.metadata?.cashApproved);
  const isInvoicePaid = booking.invoice?.status === 'PAID';

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
        <CardTitle className="text-lg font-semibold text-[#111827] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-gray-400" />
          Action Center
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {/* Pending Booking actions */}
        {booking.status === 'pending' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Review the details and approve this booking request to generate a payment link.
            </p>
            <Button
              className="w-full bg-[#111827] text-white hover:bg-gray-800"
              disabled={isActionLoading}
              onClick={onOpenAcceptModal}
            >
              Accept Booking Request
            </Button>
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              disabled={isActionLoading}
              onClick={onOpenRejectModal}
            >
              Reject Booking
            </Button>
          </div>
        )}

        {/* Cash payment requested actions */}
        {booking.status === 'accepted' && isPendingCashRequest && (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 font-medium">Cash Payment Requested</p>
              <p className="text-xs text-amber-700 mt-1">The client wants to pay by cash on site.</p>
            </div>
            <Button
              className="w-full bg-amber-500 text-white hover:bg-amber-600"
              disabled={isActionLoading}
              onClick={onApproveCash}
            >
              Approve Cash Request
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={isActionLoading}
              onClick={onRejectCash}
            >
              Reject & Demand Online Pay
            </Button>
          </div>
        )}

        {/* Approved Cash payment awaiting receipt */}
        {booking.status === 'accepted' && isApprovedCashRequest && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              You approved the cash request. Once you receive the money, mark it as paid.
            </p>
            <Button
              className="w-full bg-green-600 text-white hover:bg-green-700"
              disabled={isActionLoading}
              onClick={onOpenCashConfirmModal}
            >
              Mark as Paid (Received Cash)
            </Button>
          </div>
        )}

        {/* Paid booking awaiting event completion */}
        {booking.status === 'accepted' && isInvoicePaid && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              The invoice is fully paid. After the event, mark the booking as completed.
            </p>
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={isActionLoading}
              onClick={onCompleteEvent}
            >
              Complete Event
            </Button>
          </div>
        )}

        {/* Waiting for payment */}
        {booking.status === 'accepted' &&
          !isPendingCashRequest &&
          !isApprovedCashRequest &&
          !isInvoicePaid && (
            <div className="text-center py-4">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Waiting for client payment...</p>
            </div>
          )}

        {/* Completed status */}
        {isCompleted && (
          <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-100">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Booking Completed</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
