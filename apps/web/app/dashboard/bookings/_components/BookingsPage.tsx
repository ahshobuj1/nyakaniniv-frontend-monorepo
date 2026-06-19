'use client';

import React, {useState} from 'react';
import {AlertCircle, Calendar, Mail, CheckCircle2, Clock} from 'lucide-react';
import {Card, CardContent} from '@repo/ui';
import { useGetMyBookingsQuery, useUpdateBookingStatusMutation } from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { toast } from 'sonner';

type FilterType = 'All' | 'pending' | 'confirmed';

export default function BookingsPage() {
  const [filter, setFilter] = useState<FilterType>('All');

  // APIs
  const { data: bookingsResponse, isLoading: isBookingsLoading } = useGetMyBookingsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  // Dialog State
  const [bookingToUpdate, setBookingToUpdate] = useState<{ id: string; currentStatus: string } | null>(null);

  const bookings = bookingsResponse?.data || [];

  // Derived state for counts
  const pendingCount = bookings.filter((b: any) => b.status?.toLowerCase() === 'pending').length;
  const confirmedCount = bookings.filter((b: any) => b.status?.toLowerCase() === 'confirmed').length;
  const totalCount = bookings.length;

  const filteredBookings = bookings.filter((booking: any) => {
    if (filter === 'All') return true;
    return booking.status?.toLowerCase() === filter.toLowerCase();
  });

  const confirmStatusUpdate = async () => {
    if (!bookingToUpdate) return;
    try {
      const newStatus = bookingToUpdate.currentStatus?.toLowerCase() === 'pending' ? 'confirmed' : 'pending';
      await updateStatus({
        id: bookingToUpdate.id,
        status: newStatus,
      }).unwrap();
      toast.success(`Booking status updated to ${newStatus}`);
      setBookingToUpdate(null);
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to update status');
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
            onClick={() => setFilter('confirmed')}
            className={`flex items-center gap-2 px-2 md:px-5 py-1 md:py-2.5 rounded-md md:rounded-full text-[14px] font-semibold transition-all border ${
              filter === 'confirmed'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            Confirmed
            <span
              className={`flex items-center justify-center md:min-w-5 md:h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'confirmed' ? 'bg-primary' : 'bg-[#D1D5DB]'
              }`}>
              {confirmedCount}
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
                      <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                        Client
                      </th>
                      <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                        Event Type
                      </th>
                      <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                        Date
                      </th>
                      <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[25%]">
                        Email
                      </th>
                      <th className="py-4 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking: any, index: number) => (
                        <tr
                          key={booking.id}
                          className={`${index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} hover:bg-gray-100/50 transition-colors`}>
                          <td className="py-5 px-8 text-[14px] font-semibold text-[#111620]">
                            {booking.client?.name || 'Unknown Client'}
                          </td>
                          <td className="py-5 px-8 text-[14px] text-[#787878]">
                            {booking.eventType}
                          </td>
                          <td className="py-5 px-8 text-[14px] text-[#787878]">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.75 h-3.75 text-[#A1A1AA]" />
                              {new Date(booking.eventDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-5 px-8 text-[14px] text-[#787878]">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.75 h-3.75 text-[#A1A1AA]" />
                              {booking.client?.email || 'N/A'}
                            </div>
                          </td>
                          <td className="py-5 px-8">
                            <button
                              onClick={() => setBookingToUpdate({ id: booking.id, currentStatus: booking.status })}
                              className="focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md transition-transform hover:scale-105 active:scale-95"
                            >
                              {booking.status?.toLowerCase() === 'confirmed' || booking.status?.toLowerCase() === 'accepted' ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#10B981] text-white text-[13px] font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Confirmed
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F59E0B] text-white text-[13px] font-medium">
                                  <Clock className="w-3.5 h-3.5" />
                                  Pending
                                </div>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
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

      <ConfirmationDialog
        isOpen={!!bookingToUpdate}
        title="Update Booking Status"
        description={`Are you sure you want to mark this booking as ${bookingToUpdate?.currentStatus?.toLowerCase() === 'pending' ? 'Confirmed' : 'Pending'}?`}
        confirmText="Update Status"
        isLoading={isUpdating}
        onCancel={() => setBookingToUpdate(null)}
        onConfirm={confirmStatusUpdate}
      />
    </div>
  );
}
