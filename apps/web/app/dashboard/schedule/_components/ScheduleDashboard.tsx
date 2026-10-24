'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  useGetDjScheduleQuery,
  useGetCurrentProfileQuery,
  useConfirmCompletionMutation,
  useConfirmDirectPaymentMutation,
  Booking,
} from '@repo/store';
import { Button } from '@repo/ui';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { getBrowserTimezone } from '@/lib/timezone';
import { toast } from 'sonner';
import { ScheduleStatsBanner } from './ScheduleStatsBanner';
import { RoutineCard } from './RoutineCard';
import { ScheduleEmptyState } from './ScheduleEmptyState';
import { RoutineTabType, TabConfig } from './types';

export function ScheduleDashboard() {
  const [activeTab, setActiveTab] = useState<RoutineTabType>('today');
  const [completeBooking, setCompleteBooking] = useState<Booking | null>(null);
  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);

  const { data: scheduleResponse, isLoading, refetch } = useGetDjScheduleQuery();
  const { data: profileResponse } = useGetCurrentProfileQuery();
  const djTimezone = profileResponse?.data?.tenant?.timezone || getBrowserTimezone();

  const [confirmCompletion, { isLoading: isCompleting }] = useConfirmCompletionMutation();
  const [confirmDirectPayment, { isLoading: isConfirmingPayment }] = useConfirmDirectPaymentMutation();

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  const rawData = scheduleResponse?.data;
  const schedule = {
    today: Array.isArray(rawData?.today) ? rawData.today : [],
    tomorrow: Array.isArray(rawData?.tomorrow) ? rawData.tomorrow : [],
    upcoming: Array.isArray(rawData?.upcoming) ? rawData.upcoming : [],
    past: Array.isArray(rawData?.past) ? rawData.past : [],
    needsAction: Array.isArray(rawData?.needsAction) ? rawData.needsAction : [],
  };

  const tabs: TabConfig[] = [
    {
      key: 'today',
      label: "Today's Routine",
      count: schedule.today.length,
      description: 'Your scheduled performance call times and gig checklist for today.',
    },
    {
      key: 'tomorrow',
      label: 'Tomorrow',
      count: schedule.tomorrow.length,
      description: 'Upcoming performances tomorrow. Prepare music setlists, gear, and travel route.',
    },
    {
      key: 'upcoming',
      label: 'Upcoming Confirmed',
      count: schedule.upcoming.length,
      description: 'Chronological calendar of future confirmed gig performances.',
    },
    {
      key: 'needsAction',
      label: 'Action Needed',
      count: schedule.needsAction.length,
      description: 'Inquiries awaiting quotation proposals or direct payments awaiting verification.',
    },
    {
      key: 'past',
      label: 'Past Gigs',
      count: schedule.past.length,
      description: 'Archived performance history and client ratings.',
    },
  ];

  const currentBookings = schedule[activeTab] || [];
  const currentTabConfig = tabs.find((t) => t.key === activeTab) || tabs[0];
  const todayCount = schedule.today.length;

  const handleConfirmCompleteGig = async () => {
    if (!completeBooking) return;
    try {
      await confirmCompletion(completeBooking.id).unwrap();
      toast.success('Gig marked as completed! Performance record archived.');
      setCompleteBooking(null);
      refetch();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string; error?: { message?: string } } })?.data?.error?.message ||
        (err as { data?: { message?: string } })?.data?.message ||
        'Failed to mark gig as completed';
      toast.error(errorMsg);
    }
  };

  const handleConfirmPaymentReceived = async () => {
    if (!paymentBooking) return;
    try {
      await confirmDirectPayment(paymentBooking.id).unwrap();
      toast.success('Direct payment marked as received in records.');
      setPaymentBooking(null);
      refetch();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string; error?: { message?: string } } })?.data?.error?.message ||
        (err as { data?: { message?: string } })?.data?.message ||
        'Failed to confirm direct payment';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen p-4 md:p-2 font-sans">
      <div className="mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Section (matching DashboardOverview) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-[28px] font-bold tracking-tight text-[#111620]">
              Schedule & Routine
            </h1>
            <p className="text-[#787878] text-[15px]">
              Here&apos;s your daily gig checklist, venue call times, and routine.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {todayCount > 0 ? (
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {todayCount} Active Gig{todayCount > 1 ? 's' : ''} Today
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                Schedule Clear Today
              </span>
            )}
            <Link href="/dashboard/bookings">
              <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 h-11 rounded-lg shadow-sm transition-all active:scale-[0.98]">
                All Bookings
                <ArrowRight className="w-4 h-4 ml-1 stroke-[2.5]" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Summary Cards (matching DashboardOverview summaryStats) */}
        <ScheduleStatsBanner
          todayCount={schedule.today.length}
          tomorrowCount={schedule.tomorrow.length}
          upcomingCount={schedule.upcoming.length}
          needsActionCount={schedule.needsAction.length}
          activeTab={activeTab}
          onTabSelect={setActiveTab}
        />

        {/* Filters / Tabs (matching WalletPage & Invoices) */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-3 flex-wrap">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all border cursor-pointer ${
                    isActive
                      ? 'border-primary text-primary bg-white shadow-xs'
                      : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] rounded-full text-white ${
                      isActive ? 'bg-primary' : 'bg-[#D1D5DB]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[13px] text-[#A1A1AA] px-1">
            {currentTabConfig?.description}
          </p>
        </div>

        {/* Routine Cards List (matching EventCard & DashboardOverview) */}
        {currentBookings.length === 0 ? (
          <ScheduleEmptyState activeTab={activeTab} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentBookings.map((b) => (
              <RoutineCard
                key={b.id}
                booking={b}
                djTimezone={djTimezone}
                isToday={activeTab === 'today'}
                onOpenCompleteModal={setCompleteBooking}
                onOpenPaymentModal={setPaymentBooking}
              />
            ))}
          </div>
        )}

        {/* Complete Gig Modal */}
        <ConfirmationDialog
          isOpen={Boolean(completeBooking)}
          title="Mark Gig Completed"
          description={
            <div className="space-y-2 text-xs text-gray-600">
              <p>
                Has the performance concluded for{' '}
                <strong className="text-gray-900">
                  {completeBooking?.client?.name || 'the client'}
                </strong>
                ?
              </p>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 leading-relaxed">
                <strong>Event Conclusion:</strong> Marking this gig as completed updates your performance records and invites the client to leave a review.
              </div>
            </div>
          }
          confirmText="Mark Gig Completed"
          cancelText="Cancel"
          confirmButtonClassName="bg-primary hover:bg-primary/90 text-white text-xs font-semibold"
          isLoading={isCompleting}
          onConfirm={handleConfirmCompleteGig}
          onCancel={() => setCompleteBooking(null)}
        />

        {/* Confirm Payment Modal */}
        <ConfirmationDialog
          isOpen={Boolean(paymentBooking)}
          title="Mark Direct Payment Received"
          description={
            <div className="space-y-2.5 text-xs text-gray-600">
              <p>
                Confirm that you have received direct payment for booking ref{' '}
                <strong className="text-gray-900 font-mono">
                  {paymentBooking?.orderReference || paymentBooking?.id?.slice(0, 8)}
                </strong>{' '}
                from{' '}
                <strong className="text-gray-900">
                  {paymentBooking?.client?.name || 'the client'}
                </strong>
                ?
              </p>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 leading-relaxed">
                <strong>Direct Settlement:</strong> This marks the payment as received in your records. UpBeat Africa does not hold or escrow funds.
              </div>
            </div>
          }
          confirmText="Mark Payment as Received"
          cancelText="Cancel"
          confirmButtonClassName="bg-primary hover:bg-primary/90 text-white text-xs font-semibold"
          isLoading={isConfirmingPayment}
          onConfirm={handleConfirmPaymentReceived}
          onCancel={() => setPaymentBooking(null)}
        />
      </div>
    </div>
  );
}
