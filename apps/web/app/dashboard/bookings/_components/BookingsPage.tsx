'use client';

import React, {useState} from 'react';
import {AlertCircle, Calendar, Mail, CheckCircle2, Clock} from 'lucide-react';
import {Card, CardContent} from '@repo/ui';

// ==========================================
// 1. Types & Interfaces
// ==========================================
export type BookingStatus = 'Pending' | 'Confirmed';

export interface Booking {
  id: string;
  clientName: string;
  eventType: string;
  date: string;
  email: string;
  status: BookingStatus;
}

// ==========================================
// 2. Dummy Data
// ==========================================
const dummyBookings: Booking[] = [
  {
    id: '1',
    clientName: 'Afia Mensah',
    eventType: 'Birthday Party',
    date: '22 Dec 2025',
    email: 'afia.mensah@example.com',
    status: 'Confirmed',
  },
  {
    id: '2',
    clientName: 'Jonas Kim',
    eventType: 'Business Meeting',
    date: '01 Jan 2026',
    email: 'jonas.kim@example.com',
    status: 'Pending',
  },
  {
    id: '3',
    clientName: 'Lila Chen',
    eventType: 'Art Exhibition',
    date: '14 Feb 2026',
    email: 'lila.chen@example.com',
    status: 'Confirmed',
  },
  {
    id: '4',
    clientName: 'Marco Rossi',
    eventType: 'Wedding Reception',
    date: '03 Mar 2026',
    email: 'marco.rossi@example.com',
    status: 'Confirmed',
  },
  {
    id: '5',
    clientName: 'Sofia Patel',
    eventType: 'Corporate Retreat',
    date: '19 Apr 2026',
    email: 'sofia.patel@example.com',
    status: 'Pending',
  },
  {
    id: '6',
    clientName: 'Tariq Ahmed',
    eventType: 'Graduation Ceremony',
    date: '27 May 2026',
    email: 'tariq.ahmed@example.com',
    status: 'Pending',
  },
  {
    id: '7',
    clientName: 'Nina Torres',
    eventType: 'Charity Gala',
    date: '15 Jun 2026',
    email: 'nina.torres@example.com',
    status: 'Confirmed',
  },
  {
    id: '8',
    clientName: 'Omar Farah',
    eventType: 'Tech Conference',
    date: '10 Jul 2026',
    email: 'omar.farah@example.com',
    status: 'Confirmed',
  },
  {
    id: '9',
    clientName: 'Priya Singh',
    eventType: 'Book Launch',
    date: '25 Aug 2026',
    email: 'priya.singh@example.com',
    status: 'Pending',
  },
  {
    id: '10',
    clientName: 'Leo Martinez',
    eventType: 'Film Screening',
    date: '30 Sep 2026',
    email: 'leo.martinez@example.com',
    status: 'Confirmed',
  },
];

type FilterType = 'All' | 'Pending' | 'Confirmed';

export default function BookingsPage() {
  const [filter, setFilter] = useState<FilterType>('All');
  const [bookings] = useState<Booking[]>(dummyBookings);

  // Derived state for counts
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const confirmedCount = bookings.filter(
    (b) => b.status === 'Confirmed',
  ).length;
  const totalCount = bookings.length;

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'All') return true;
    return booking.status === filter;
  });

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

          {/* <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 h-[44px] rounded-lg shadow-sm transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4 mr-2 stroke-[2.5]" />
            Add Event
          </Button> */}
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
          {/* All Tab */}
          <button
            onClick={() => setFilter('All')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all border ${
              filter === 'All'
                ? 'border-primary text-primary bg-white'
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

          {/* Pending Tab */}
          <button
            onClick={() => setFilter('Pending')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all border ${
              filter === 'Pending'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            Pending
            <span
              className={`flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'Pending' ? 'bg-primary' : 'bg-[#D1D5DB]'
              }`}>
              {pendingCount}
            </span>
          </button>

          {/* Confirmed Tab */}
          <button
            onClick={() => setFilter('Confirmed')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all border ${
              filter === 'Confirmed'
                ? 'border-primary text-primary bg-white'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}>
            Confirmed
            <span
              className={`flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] rounded-full text-white ${
                filter === 'Confirmed' ? 'bg-primary' : 'bg-[#D1D5DB]'
              }`}>
              {confirmedCount}
            </span>
          </button>
        </div>

        {/* Table Card */}
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
                    filteredBookings.map((booking, index) => (
                      <tr
                        key={booking.id}
                        // Alternate row backgrounds: Odd rows gets #F5F5F5, Even gets White
                        className={`${index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} hover:bg-gray-100/50 transition-colors`}>
                        <td className="py-5 px-8 text-[14px] font-semibold text-[#111620]">
                          {booking.clientName}
                        </td>
                        <td className="py-5 px-8 text-[14px] text-[#787878]">
                          {booking.eventType}
                        </td>
                        <td className="py-5 px-8 text-[14px] text-[#787878]">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.75 h-3.75 text-[#A1A1AA]" />
                            {booking.date}
                          </div>
                        </td>
                        <td className="py-5 px-8 text-[14px] text-[#787878]">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.75 h-3.75 text-[#A1A1AA]" />
                            {booking.email}
                          </div>
                        </td>
                        <td className="py-5 px-8">
                          {booking.status === 'Confirmed' ? (
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
      </div>
    </div>
  );
}
