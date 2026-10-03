'use client';

import {
  Calendar,
  Clock,
  MapPin,
  Music,
} from 'lucide-react';
import type { ParsedEventDetails } from '@/lib/bookingStatusHelper';

interface EventScheduleCardProps {
  formattedDate: string;
  displayTime: string;
  address?: string | null;
  eventType?: string | null;
  duration?: string | null;
}

/**
 * Displays event date, time, venue and category in a compact card layout.
 */
export function EventScheduleCard({
  formattedDate,
  displayTime,
  address,
  eventType,
  duration,
}: EventScheduleCardProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
        Event Schedule & Location
      </h2>

      <div className="space-y-3 bg-gray-50/70 p-4 rounded-sm border border-gray-200/80 text-xs">
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-medium text-gray-400 uppercase block">Event Date</span>
            <span className="font-semibold text-gray-900 mt-0.5 block">{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-medium text-gray-400 uppercase block">Event Time (12-Hour)</span>
            <span className="font-semibold text-gray-900 mt-0.5 block">
              {displayTime} {duration ? `(${duration})` : ''}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-medium text-gray-400 uppercase block">Venue / Location</span>
            <span className="font-semibold text-gray-900 mt-0.5 block">
              {address || 'Address provided'}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Music className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-medium text-gray-400 uppercase block">Event Category</span>
            <span className="font-semibold text-gray-900 mt-0.5 block">
              {eventType || 'DJ Performance'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
