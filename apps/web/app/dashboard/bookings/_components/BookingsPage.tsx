'use client';

import React, {useState} from 'react';
import {AlertCircle, Calendar, Mail, CheckCircle2, Clock, Phone, MapPin, Eye, XCircle} from 'lucide-react';
import {Card, CardContent, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Button} from '@repo/ui';
import { useGetMyBookingsQuery, useUpdateBookingStatusMutation, useHandleCashRequestDecisionMutation, useMarkCashAsPaidMutation } from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'sonner';

type FilterType = 'All' | 'pending' | 'accepted' | 'completed' | 'canceled';

export default function BookingsPage() {
  const [filter, setFilter] = useState<FilterType>('All');

  // APIs
  const { data: bookingsResponse, isLoading: isBookingsLoading } = useGetMyBookingsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const [handleCash, { isLoading: handlingCash }] = useHandleCashRequestDecisionMutation();
  const [markPaid, { isLoading: isMarkingPaid }] = useMarkCashAsPaidMutation();
  const isActionLoading = isUpdating || handlingCash || isMarkingPaid;

  // Dialog State
  const [bookingToUpdate, setBookingToUpdate] = useState<{ 
    id: string; 
    currentStatus: string;
    isPendingCashRequest?: boolean;
    isApprovedCashRequest?: boolean;
    isInvoicePaid?: boolean;
  } | null>(null);
  const [priceInput, setPriceInput] = useState('');
  const [detailsModalContent, setDetailsModalContent] = useState<string | null>(null);

  const bookings = bookingsResponse?.data || [];

  // Derived state for counts
  const pendingCount = bookings.filter((b: any) => b.status?.toLowerCase() === 'pending').length;
  const acceptedCount = bookings.filter((b: any) => b.status?.toLowerCase() === 'accepted').length;
  const completedCount = bookings.filter((b: any) => b.status?.toLowerCase() === 'completed').length;
  const canceledCount = bookings.filter((b: any) => b.status?.toLowerCase() === 'canceled' || b.status?.toLowerCase() === 'rejected').length;
  const totalCount = bookings.length;

  const filteredBookings = bookings.filter((booking: any) => {
    if (filter === 'All') return true;
    if (filter === 'canceled') return booking.status?.toLowerCase() === 'canceled' || booking.status?.toLowerCase() === 'rejected';
    return booking.status?.toLowerCase() === filter.toLowerCase();
  });

  const handleStatusUpdate = async (newStatus: 'ACCEPTED' | 'COMPLETED') => {
    if (!bookingToUpdate) return;
    
    if (newStatus === 'ACCEPTED' && !priceInput) {
      toast.error('Please enter a total amount for the booking');
      return;
    }

    try {
      const payload: any = {
        id: bookingToUpdate.id,
        status: newStatus.toLowerCase(),
      };
      
      if (newStatus === 'ACCEPTED') {
        payload.totalAmount = parseFloat(priceInput);
      }

      await updateStatus(payload).unwrap();
      toast.success(`Booking marked as ${newStatus.toLowerCase()}!`);
      setBookingToUpdate(null);
      setPriceInput('');
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to update status');
    }
  };

  const handleRejectBooking = async () => {
    if (!bookingToUpdate) return;
    if (confirm('Are you sure you want to reject this booking?')) {
      try {
        await updateStatus({ id: bookingToUpdate.id, status: 'rejected' as any }).unwrap();
        toast.success('Booking rejected');
        setBookingToUpdate(null);
      } catch (error: any) {
        toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to reject booking');
      }
    }
  };

  const handleCashDecision = async (decision: 'approve' | 'reject') => {
    if (!bookingToUpdate) return;
    try {
      await handleCash({ id: bookingToUpdate.id, decision }).unwrap();
      toast.success(`Cash request ${decision}d successfully!`);
      setBookingToUpdate(null);
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || `Failed to ${decision} cash request`);
    }
  };

  const handleMarkCashPaid = async (id: string) => {
    if (!confirm('Confirm you received the cash?')) return;
    try {
      await markPaid(id).unwrap();
      toast.success('Payment marked as paid via Cash!');
      setBookingToUpdate(null);
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
              Check out all the bookings!
            </p>
          </div>
        </div>

        {/* Alert Banner */}
        {pendingCount > 0 && (
          <div className="bg-[#FFF8E6] border border-[#FDE68A] rounded-xl p-4 flex items-center gap-3 text-[#D97706]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-[15px]">
              You have{' '}
              <span className="font-bold">
                {pendingCount} pending booking requests
              </span>{' '}
              waiting for your response.
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-3 pt-2 pb-2">
          <button
            onClick={() => setFilter('All')}
            className={`flex items-center gap-2 px-2 md:px-5 py-1 md:py-2.5 rounded-md md:rounded-full text-[14px] font-semibold transition-all border ${
              filter === 'All'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            All
            <span
              className={`flex items-center justify-center md:min-w-5 md:h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'All' ? 'bg-primary' : 'bg-[#D1D5DB]'
              }`}>
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`flex items-center gap-2 px-2 md:px-5 py-1 md:py-2.5 rounded-md md:rounded-full text-[14px] font-semibold transition-all border ${
              filter === 'pending'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            Pending
            <span
              className={`flex items-center justify-center md:min-w-5 md:h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'pending' ? 'bg-primary' : 'bg-[#D1D5DB]'
              }`}>
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('accepted')}
            className={`flex items-center gap-2 px-2 md:px-5 py-1 md:py-2.5 rounded-md md:rounded-full text-[14px] font-semibold transition-all border ${
              filter === 'accepted'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            Accepted
            <span
              className={`flex items-center justify-center md:min-w-5 md:h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'accepted' ? 'bg-primary' : 'bg-[#D1D5DB]'
              }`}>
              {acceptedCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('completed')}
            className={`flex items-center gap-2 px-2 md:px-5 py-1 md:py-2.5 rounded-md md:rounded-full text-[14px] font-semibold transition-all border ${
              filter === 'completed'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            Completed
            <span
              className={`flex items-center justify-center md:min-w-5 md:h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'completed' ? 'bg-primary' : 'bg-[#D1D5DB]'
              }`}>
              {completedCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('canceled')}
            className={`flex items-center gap-2 px-2 md:px-5 py-1 md:py-2.5 rounded-md md:rounded-full text-[14px] font-semibold transition-all border ${
              filter === 'canceled'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            Canceled
            <span
              className={`flex items-center justify-center md:min-w-5 md:h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'canceled' ? 'bg-primary' : 'bg-[#D1D5DB]'
              }`}>
              {canceledCount}
            </span>
          </button>
        </div>

        {/* Table Card */}
        {isBookingsLoading ? (
          <LoadingSpinner />
        ) : (
          <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden rounded-2xl bg-white">
            <CardContent className="p-0">
              <div className="p-4 md:p-4 border-b-4 border-gray-100">
                <h2 className="text-[18px] font-bold text-[#111620]">Bookings</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-225 text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[25%]">
                        Client
                      </th>
                      <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                        Phone
                      </th>
                      <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[25%]">
                        Event Type
                      </th>
                      <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                       Event Date
                      </th>
                      <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                       Requested Date
                      </th>
                      <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                        Amount
                      </th>
                      <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[10%] text-center">
                        Details
                      </th>
                      <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[1%] whitespace-nowrap">
                        Status & Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking: any, index: number) => {
                        const cashTransaction = booking.invoice?.transactions?.find((tx: any) => tx.gateway === 'CASH');
                        const isPendingCashRequest = cashTransaction?.status === 'PENDING' && !cashTransaction?.metadata?.cashApproved;
                        const isApprovedCashRequest = cashTransaction?.status === 'PENDING' && cashTransaction?.metadata?.cashApproved;
                        const isInvoicePaid = booking.invoice?.status === 'PAID';
                        
                        return (
                        <tr
                          key={booking.id}
                          className={`${index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} hover:bg-gray-100/50 transition-colors`}>
                          <td className="py-5 px-8 text-[14px] font-semibold text-[#111620]">
                            <div className="flex flex-col gap-1">
                              <span>{booking.client?.name || 'Unknown Client'}</span>
                              <span className="text-[12px] text-[#787878] font-normal flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{booking.client?.email || 'N/A'}</span>
                              </span>
                            </div>
                          </td>
                          <td className="py-5 px-8 text-[14px] text-[#787878]">
                            {booking.client?.phone ? (
                              <span className="text-[13px] font-medium flex items-center gap-1.5 text-[#111620]">
                                <Phone className="w-3.5 h-3.5 shrink-0 text-[#787878]" />
                                <span className="truncate">{booking.client.phone}</span>
                              </span>
                            ) : '-'}
                          </td>
                          <td className="py-5 px-8 text-[14px] text-[#787878]">
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-[#111620] capitalize">{booking.eventType}</span>
                              {booking.address && (
                                <span className="text-[12px] text-[#787878] font-normal flex items-center gap-1.5">
                                  <MapPin className="w-3 h-3 shrink-0" />
                                  <span className="truncate max-w-[150px]" title={booking.address}>{booking.address}</span>
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-5 px-8 text-[14px] text-[#787878]">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 font-medium text-[#111620] w-max">                           
                                {new Date(booking.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </div>
                          
                            </div>
                          </td>

                            

                            <td className="py-5 px-8 text-[14px] text-[#787878]">
                            {booking.createdAt && (
                            <div className="flex items-center gap-2 font-medium text-[#111620] w-max">
                              {new Date(booking.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                          )}
                          </td>        

                          <td className="py-5 px-8 text-[14px] font-medium text-[#111620]">
                            {booking.totalAmount ? `$${booking.totalAmount}` : '-'}
                          </td>
                          <td className="py-5 px-8 text-center">
                            <a
                              href={`/dashboard/bookings/${booking.id}`}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors cursor-pointer"
                              title="View Event Details"
                            >
                              <Eye className="w-4 h-4 " />
                            </a>
                          </td>
                          <td className="py-5 px-8 flex flex-col items-start gap-2">
                            <button
                              onClick={() => {
                                setBookingToUpdate({ 
                                  id: booking.id, 
                                  currentStatus: booking.status,
                                  isPendingCashRequest,
                                  isApprovedCashRequest,
                                  isInvoicePaid
                                });
                                setPriceInput('');
                              }}
                              className="focus:outline-none focus:ring-2 cursor-pointer focus:ring-primary/20 rounded-md transition-transform hover:scale-105 active:scale-95"
                            >
                              {booking.status?.toLowerCase() === 'completed' ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#10B981] text-white text-[13px] font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Completed
                                </div>
                              ) : booking.status?.toLowerCase() === 'accepted' ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500 text-white text-[13px] font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Accepted
                                </div>
                              ) : booking.status?.toLowerCase() === 'canceled' || booking.status?.toLowerCase() === 'rejected' ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500 text-white text-[13px] font-medium">
                                  <XCircle className="w-3.5 h-3.5" />
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F59E0B] text-white text-[13px] font-medium">
                                  <Clock className="w-3.5 h-3.5" />
                                  Pending
                                </div>
                              )}
                            </button>

                            {isPendingCashRequest && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#FFF8E6] border border-[#FDE68A] text-[#D97706] text-[11px] font-bold">
                                Cash Requested
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-12 text-center text-[#787878]">
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

      {/* Status Update Dialog */}
      <Dialog open={!!bookingToUpdate} onOpenChange={(open) => !open && setBookingToUpdate(null)}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl border-none">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-bold text-[#111620]">
              Update Booking Status
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-[14px] text-[#787878]">
              Current status: <span className="font-semibold text-black uppercase">{bookingToUpdate?.currentStatus || 'Unknown'}</span>
            </p>
            
            {bookingToUpdate?.currentStatus?.toLowerCase() === 'pending' && (
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#111620]">
                  Total Amount / Price
                </label>
                <Input
                  type="number"
                  placeholder="Enter total amount (e.g. 500)"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="bg-[#F5F5F5] border-transparent h-11 rounded-[10px] focus-visible:ring-1 focus-visible:ring-primary shadow-none"
                />
                <p className="text-[12px] text-gray-500">
                  Accepting this booking will generate an invoice for the client. An email will send to the client with the invoice and payment link.
                </p>
              </div>
            )}
            
            {bookingToUpdate?.isPendingCashRequest && (
              <div className="bg-[#FFF8E6] border border-[#FDE68A] rounded-xl p-4 flex items-center gap-3 text-[#D97706]">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-[13px] font-medium">
                  The client has requested to pay by cash.
                </p>
              </div>
            )}
            
            <div className="flex flex-col gap-3 pt-4">
              {bookingToUpdate?.currentStatus?.toLowerCase() === 'pending' && (
                <>
                  <Button 
                    onClick={() => handleStatusUpdate('ACCEPTED')}
                    disabled={isActionLoading}
                    className="bg-primary hover:bg-primary/90 text-white font-bold h-11 w-full rounded-[10px]"
                  >
                    {isActionLoading ? 'Processing...' : 'Accept Booking Request'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleRejectBooking}
                    disabled={isActionLoading}
                    className="h-11 w-full rounded-[10px] text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    Reject Booking
                  </Button>
                </>
              )}

              {bookingToUpdate?.currentStatus?.toLowerCase() === 'accepted' && bookingToUpdate.isPendingCashRequest && (
                <>
                  <Button 
                    onClick={() => handleCashDecision('approve')}
                    disabled={isActionLoading}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold h-11 w-full rounded-[10px]"
                  >
                    {isActionLoading ? 'Processing...' : 'Approve Cash Request'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleCashDecision('reject')}
                    disabled={isActionLoading}
                    className="h-11 w-full rounded-[10px]"
                  >
                    Reject & Demand Online Pay
                  </Button>
                </>
              )}

              {bookingToUpdate?.currentStatus?.toLowerCase() === 'accepted' && bookingToUpdate.isApprovedCashRequest && (
                <Button 
                  onClick={() => handleMarkCashPaid(bookingToUpdate.id)}
                  disabled={isActionLoading}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold h-11 w-full rounded-[10px]"
                >
                  {isActionLoading ? 'Processing...' : 'Mark as Paid (Received Cash)'}
                </Button>
              )}

              {bookingToUpdate?.currentStatus?.toLowerCase() === 'accepted' && bookingToUpdate.isInvoicePaid && (
                <Button 
                  onClick={() => handleStatusUpdate('COMPLETED')}
                  disabled={isActionLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 w-full rounded-[10px]"
                >
                  {isActionLoading ? 'Processing...' : 'Complete Event'}
                </Button>
              )}

              {bookingToUpdate?.currentStatus?.toLowerCase() === 'accepted' && !bookingToUpdate.isPendingCashRequest && !bookingToUpdate.isApprovedCashRequest && !bookingToUpdate.isInvoicePaid && (
                <div className="text-center py-4">
                  <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Waiting for client payment...</p>
                </div>
              )}

              {(bookingToUpdate?.currentStatus?.toLowerCase() === 'canceled' || bookingToUpdate?.currentStatus?.toLowerCase() === 'rejected') && (
                <div className="text-center py-4">
                  <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">This booking was {bookingToUpdate.currentStatus.toLowerCase()}.</p>
                </div>
              )}

              <Button 
                variant="outline" 
                onClick={() => setBookingToUpdate(null)}
                className="h-11 w-full rounded-[10px] mt-2"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={!!detailsModalContent} onOpenChange={(open) => !open && setDetailsModalContent(null)}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-none">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-bold text-[#111620]">
              Event Details
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-[#F9FAFB] rounded-xl p-4 border border-gray-100 max-h-[300px] overflow-y-auto">
              <p className="text-[14px] text-[#4B5563] whitespace-pre-wrap leading-relaxed">
                {detailsModalContent}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={() => setDetailsModalContent(null)}
                className="bg-primary hover:bg-primary/90 text-white font-bold px-6 h-10 rounded-[10px]"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
