'use client';

import React, {useState} from 'react';
import {AlertCircle, Calendar, Mail, CheckCircle2, Clock, Phone, MapPin} from 'lucide-react';
import {Card, CardContent, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Button} from '@repo/ui';
import { useGetMyBookingsQuery, useUpdateBookingStatusMutation, useMarkBookingPaidMutation } from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'sonner';

type FilterType = 'All' | 'pending' | 'accepted' | 'completed';

export default function BookingsPage() {
  const [filter, setFilter] = useState<FilterType>('All');

  // APIs
  const { data: bookingsResponse, isLoading: isBookingsLoading } = useGetMyBookingsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();
  const [markPaid, { isLoading: isMarkingPaid }] = useMarkBookingPaidMutation();

  // Dialog State
  const [bookingToUpdate, setBookingToUpdate] = useState<{ 
    id: string; 
    currentStatus: string;
    isCashRequested?: boolean;
    paymentId?: string;
  } | null>(null);
  const [priceInput, setPriceInput] = useState('');

  const bookings = bookingsResponse?.data || [];

  // Derived state for counts
  const pendingCount = bookings.filter((b: any) => b.status?.toLowerCase() === 'pending').length;
  const acceptedCount = bookings.filter((b: any) => b.status?.toLowerCase() === 'accepted').length;
  const completedCount = bookings.filter((b: any) => b.status?.toLowerCase() === 'completed').length;
  const totalCount = bookings.length;

  const filteredBookings = bookings.filter((booking: any) => {
    if (filter === 'All') return true;
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
        status: newStatus,
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

  const handleMarkCashPaid = async (paymentId: string) => {
    try {
      await markPaid(paymentId).unwrap();
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
                        Date
                      </th>
                      <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                        Amount
                      </th>
                      <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[1%] whitespace-nowrap">
                        Status & Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking: any, index: number) => {
                        const isCashRequested = booking.payment?.method === 'CASH' && booking.payment?.status === 'unpaid';
                        
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
                              <span className="font-medium text-[#111620]">{booking.eventType}</span>
                              {booking.address && (
                                <span className="text-[12px] text-[#787878] font-normal flex items-center gap-1.5">
                                  <MapPin className="w-3 h-3 shrink-0" />
                                  <span className="truncate max-w-[150px]" title={booking.address}>{booking.address}</span>
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-5 px-8 text-[14px] text-[#787878]">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.75 h-3.75 text-[#A1A1AA]" />
                              {new Date(booking.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                          </td>
                          <td className="py-5 px-8 text-[14px] font-medium text-[#111620]">
                            {booking.totalAmount ? `$${booking.totalAmount}` : '-'}
                          </td>
                          <td className="py-5 px-8 flex flex-col items-start gap-2">
                            <button
                              onClick={() => {
                                setBookingToUpdate({ 
                                  id: booking.id, 
                                  currentStatus: booking.status,
                                  isCashRequested: isCashRequested,
                                  paymentId: booking.payment?.id
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
                              ) : (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F59E0B] text-white text-[13px] font-medium">
                                  <Clock className="w-3.5 h-3.5" />
                                  Pending
                                </div>
                              )}
                            </button>

                            {isCashRequested && (
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
                          colSpan={5}
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
            
            {bookingToUpdate?.isCashRequested && (
              <div className="bg-[#FFF8E6] border border-[#FDE68A] rounded-xl p-4 flex items-center gap-3 text-[#D97706]">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-[13px] font-medium">
                  The client has requested to pay by cash. You can mark this booking as paid once you receive the cash.
                </p>
              </div>
            )}
            
            <div className="flex flex-col gap-3 pt-4">
              {bookingToUpdate?.currentStatus?.toLowerCase() === 'pending' && (
                <Button 
                  onClick={() => handleStatusUpdate('ACCEPTED')}
                  disabled={isUpdating}
                  className="bg-primary hover:bg-primary/90 text-white font-bold h-11 w-full rounded-[10px]"
                >
                  {isUpdating ? 'Updating...' : 'Accept Booking'}
                </Button>
              )}

              {bookingToUpdate?.currentStatus?.toLowerCase() === 'accepted' && !bookingToUpdate.isCashRequested && (
                <Button 
                  onClick={() => handleStatusUpdate('COMPLETED')}
                  disabled={isUpdating}
                  className="bg-[#10B981] hover:bg-[#10B981]/90 text-white font-bold h-11 w-full rounded-[10px]"
                >
                  {isUpdating ? 'Updating...' : 'Mark as Completed'}
                </Button>
              )}

              {bookingToUpdate?.isCashRequested && bookingToUpdate.paymentId && (
                <Button 
                  onClick={() => handleMarkCashPaid(bookingToUpdate.paymentId!)}
                  disabled={isMarkingPaid}
                  className="bg-[#10B981] hover:bg-[#10B981]/90 text-white font-bold h-11 w-full rounded-[10px]"
                >
                  {isMarkingPaid ? 'Processing...' : 'Confirm Cash Received & Mark Paid'}
                </Button>
              )}

              <Button 
                variant="outline" 
                onClick={() => setBookingToUpdate(null)}
                className="h-11 w-full rounded-[10px]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
