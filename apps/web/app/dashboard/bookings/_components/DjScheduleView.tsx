/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Eye,
  User,
} from 'lucide-react';
import { Button, Card } from '@repo/ui';
import { useGetDjScheduleQuery, useGetCurrentProfileQuery } from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  getBookingStatusBadge,
  getDirectPaymentStatusBadge,
} from '@/lib/bookingStatusHelper';
import { formatDateInTz, formatTimeInTz, getBrowserTimezone } from '@/lib/timezone';

type ScheduleTab = 'needsAction' | 'today' | 'tomorrow' | 'upcoming' | 'past';

export function DjScheduleView() {
  const [activeTab, setActiveTab] = useState<ScheduleTab>('needsAction');
  const { data: scheduleResponse, isLoading } = useGetDjScheduleQuery();
  const { data: profileResponse } = useGetCurrentProfileQuery();
  const djTimezone = profileResponse?.data?.tenant?.timezone || getBrowserTimezone();

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const rawData: any = scheduleResponse?.data;
  const schedule: Record<ScheduleTab, any[]> = {
    today: Array.isArray(rawData?.today) ? rawData.today : [],
    tomorrow: Array.isArray(rawData?.tomorrow) ? rawData.tomorrow : [],
    upcoming: Array.isArray(rawData?.upcoming) ? rawData.upcoming : [],
    past: Array.isArray(rawData?.past) ? rawData.past : [],
    needsAction: Array.isArray(rawData?.needsAction) ? rawData.needsAction : [],
  };

  const tabs: { key: ScheduleTab; label: string; count: number }[] = [
    { key: 'needsAction', label: 'Needs Action', count: schedule.needsAction.length },
    { key: 'today', label: 'Today', count: schedule.today.length },
    { key: 'tomorrow', label: 'Tomorrow', count: schedule.tomorrow.length },
    { key: 'upcoming', label: 'Upcoming', count: schedule.upcoming.length },
    { key: 'past', label: 'Past Gigs', count: schedule.past.length },
  ];

  const currentBookings = schedule[activeTab] || [];

  return (
    <div className="space-y-6">
      {/* Schedule Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const isAction = tab.key === 'needsAction' && tab.count > 0;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}>
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : isAction
                    ? 'bg-amber-100 text-amber-800 font-bold'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Booking Cards Grid */}
      {currentBookings.length === 0 ? (
        <Card className="border border-dashed border-gray-200 rounded-xl bg-white p-12 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
            <Calendar className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-gray-700">No events in this view</p>
          <p className="text-xs text-gray-400 mt-1">
            {activeTab === 'needsAction'
              ? 'Great work! All your booking requests and payments are up to date.'
              : 'You have no gigs scheduled for this timeframe.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentBookings.map((b: any) => {
            const statusBadge = getBookingStatusBadge(b.status, b.eventDate);
            const directBadge = getDirectPaymentStatusBadge(b.directPaymentStatus);
            const tz = djTimezone;
            const isDifferentTz = b.eventTimezone && b.eventTimezone !== djTimezone;
            const dateStr = b.eventDate
              ? formatDateInTz(b.eventDate, tz, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })
              : 'Date TBD';
            const timeStr = b.eventDate ? formatTimeInTz(b.eventDate, tz) : '';

            return (
              <Card
                key={b.id}
                className="bg-white border border-gray-200 rounded-xl shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
                <div className="p-5 space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                        {b.orderReference || b.id.slice(0, 8)}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900 mt-0.5 line-clamp-1">
                        {b.eventType || 'DJ Performance'}
                      </h3>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border shrink-0 ${statusBadge.badgeClass}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="font-semibold text-gray-800">
                      {b.client?.name || 'Client'}
                    </span>
                    {b.client?.phone && (
                      <span className="text-gray-400">• {b.client.phone}</span>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-1 text-xs">
                    <div className="flex flex-col text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="font-semibold">{dateStr}</span>
                        {timeStr && <span className="text-gray-500 font-mono">at {timeStr}</span>}
                      </div>
                      {isDifferentTz && (
                        <span className="text-[10px] text-gray-400 pl-5">
                          Client: {formatTimeInTz(b.eventDate, b.eventTimezone)} ({b.eventTimezone})
                        </span>
                      )}
                    </div>

                    {b.address && (
                      <div className="flex items-start gap-1.5 text-gray-500 text-[11px] line-clamp-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <span>{b.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Payment & Negotiation Info */}
                  {(() => {
                    const agreement = b.agreement;
                    const hasAgreement = Boolean(agreement);
                    const latestQuote = b.quotes?.[0];
                    const isNegotiating =
                      !hasAgreement &&
                      Boolean(latestQuote && latestQuote.status === 'PROPOSED');
                    const isClientCounteroffer =
                      isNegotiating && latestQuote?.proposedBy === 'CLIENT';
                    const isDjQuotePendingClient =
                      isNegotiating && latestQuote?.proposedBy === 'DJ';

                    return (
                      <div className="p-2.5 bg-gray-50 rounded-lg flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-gray-400 block">
                            {hasAgreement ? 'Agreed Fee' : latestQuote ? 'Proposed Fee' : 'Pending Fee'}
                          </span>
                          <span className="font-bold font-mono text-gray-900">
                            {b.currencyCode || 'KES'}{' '}
                            {Number(
                              agreement?.agreedAmount ||
                                latestQuote?.amount ||
                                b.totalAmount ||
                                0,
                            ).toLocaleString()}
                          </span>
                        </div>

                        {isClientCounteroffer ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-300 font-bold animate-pulse">
                            Counteroffer
                          </span>
                        ) : isDjQuotePendingClient ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                            Quote Sent
                          </span>
                        ) : hasAgreement ? (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border ${directBadge.badgeClass}`}>
                            {directBadge.label}
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                            Needs Quote
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Footer Action */}
                <div className="p-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end">
                  <Link href={`/dashboard/bookings/${b.id}`} className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-semibold rounded-lg h-8 flex items-center justify-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Booking Details</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
