import { Booking } from '@repo/store';

export type RoutineTabType = 'today' | 'tomorrow' | 'upcoming' | 'needsAction' | 'past';

export interface TabConfig {
  key: RoutineTabType;
  label: string;
  count: number;
  description: string;
}

export interface RoutineCardProps {
  booking: Booking;
  djTimezone: string;
  isToday?: boolean;
  onOpenCompleteModal?: (booking: Booking) => void;
  onOpenPaymentModal?: (booking: Booking) => void;
}

export interface ScheduleStatsProps {
  todayCount: number;
  tomorrowCount: number;
  upcomingCount: number;
  needsActionCount: number;
  activeTab: RoutineTabType;
  onTabSelect: (tab: RoutineTabType) => void;
}
