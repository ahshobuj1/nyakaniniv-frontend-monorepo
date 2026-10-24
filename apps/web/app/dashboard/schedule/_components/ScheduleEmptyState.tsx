'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Card, Button } from '@repo/ui';
import { RoutineTabType } from './types';

interface ScheduleEmptyStateProps {
  activeTab: RoutineTabType;
}

export function ScheduleEmptyState({ activeTab }: ScheduleEmptyStateProps) {
  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'today':
        return {
          icon: Sparkles,
          title: 'No Performances Scheduled For Today',
          desc: 'Your schedule is clear today. Take time to polish your setlists or review upcoming gig inquiries.',
          showButton: true,
        };
      case 'tomorrow':
        return {
          icon: Calendar,
          title: 'No Performances Scheduled For Tomorrow',
          desc: 'You have no confirmed gigs on the calendar for tomorrow. Review your weekly bookings below.',
          showButton: true,
        };
      case 'needsAction':
        return {
          icon: CheckCircle2,
          title: 'All Clear — No Actions Pending',
          desc: 'Outstanding quotation proposals and direct payment receipts have been reviewed and confirmed.',
          showButton: false,
        };
      case 'upcoming':
        return {
          icon: Calendar,
          title: 'No Future Gigs on the Calendar',
          desc: 'Share your public DJ portfolio website with event organizers to start accepting performance bookings.',
          showButton: true,
        };
      case 'past':
        return {
          icon: AlertCircle,
          title: 'No Past Performance Records',
          desc: 'Completed events and performances will appear here along with client reviews and feedback.',
          showButton: false,
        };
      default:
        return {
          icon: Calendar,
          title: 'No Records Found',
          desc: 'No bookings match this routine category.',
          showButton: true,
        };
    }
  };

  const { icon: Icon, title, desc, showButton } = getEmptyMessage();

  return (
    <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] rounded-2xl bg-white p-12 md:p-16 text-center space-y-4">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
        <Icon className="w-7 h-7 stroke-[1.5]" />
      </div>
      <div className="space-y-1.5">
        <h4 className="text-[18px] font-bold text-[#111620]">{title}</h4>
        <p className="text-[14px] text-[#787878] max-w-md mx-auto leading-relaxed">
          {desc}
        </p>
      </div>
      {showButton && (
        <div className="pt-2">
          <Link href="/dashboard/bookings">
            <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 h-11 rounded-lg shadow-sm transition-all active:scale-[0.98] text-sm">
              View All Bookings
              <ArrowRight className="w-4 h-4 ml-1 stroke-[2.5]" />
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
