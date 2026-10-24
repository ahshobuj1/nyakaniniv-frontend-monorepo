'use client';

import React from 'react';
import { Sparkles, CalendarClock, CalendarDays, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@repo/ui';
import { ScheduleStatsProps } from './types';

export function ScheduleStatsBanner({
  todayCount,
  tomorrowCount,
  upcomingCount,
  needsActionCount,
  activeTab,
  onTabSelect,
}: ScheduleStatsProps) {
  const cards = [
    {
      tab: 'today' as const,
      title: "Today's Gigs",
      count: todayCount,
      icon: Sparkles,
      statusText: todayCount > 0 ? 'Active' : 'Clear',
      isPositive: todayCount > 0,
    },
    {
      tab: 'tomorrow' as const,
      title: "Tomorrow's Gigs",
      count: tomorrowCount,
      icon: CalendarClock,
      statusText: tomorrowCount > 0 ? 'Upcoming' : 'Clear',
      isPositive: true,
    },
    {
      tab: 'upcoming' as const,
      title: 'Upcoming Confirmed',
      count: upcomingCount,
      icon: CalendarDays,
      statusText: 'On Calendar',
      isPositive: true,
    },
    {
      tab: 'needsAction' as const,
      title: 'Action Needed',
      count: needsActionCount,
      icon: AlertCircle,
      statusText: needsActionCount > 0 ? 'Review Needed' : 'All Clear',
      isPositive: needsActionCount === 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        const isActive = activeTab === c.tab;
        return (
          <Card
            key={c.tab}
            onClick={() => onTabSelect(c.tab)}
            className={`cursor-pointer transition-all border rounded-sm bg-white shadow-2xs hover:border-gray-300 ${
              isActive
                ? 'border-primary ring-1 ring-primary bg-red-50/10'
                : 'border-gray-200'
            }`}
          >
            <CardContent className="p-3.5 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider truncate">
                  {c.title}
                </span>
                <Icon
                  className={`w-4 h-4 shrink-0 stroke-[1.5] ${
                    isActive ? 'text-primary' : 'text-gray-400'
                  }`}
                />
              </div>

              <div className="flex items-baseline justify-between gap-2 mt-2">
                <span className="text-[22px] font-bold text-[#111620] leading-none">
                  {c.count}
                </span>
                <span
                  className={`text-[11px] font-semibold whitespace-nowrap ${
                    c.isPositive ? 'text-[#10B981]' : 'text-primary'
                  }`}
                >
                  {c.statusText}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
