'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { Music, Clock, MapPin } from 'lucide-react';
import { Booking } from '@repo/store';

interface EventInfoCardProps {
  booking: Booking;
}

export function EventInfoCard({ booking }: EventInfoCardProps) {
  const rawDetails = booking.eventDetails || '';
  let startTime = '';
  let duration = '';
  const otherLines: string[] = [];

  rawDetails.split('\n').forEach((line: string) => {
    if (line.startsWith('Start Time:')) {
      startTime = line.replace('Start Time:', '').trim();
    } else if (line.startsWith('Duration:')) {
      duration = line.replace('Duration:', '').trim();
    } else if (line.startsWith('Requirements:')) {
      otherLines.push(line.replace('Requirements:', '').trim());
    } else if (line.trim()) {
      otherLines.push(line.trim());
    }
  });

  const requirements = otherLines.join('\n').trim();
  const eventDateFormatted = booking.eventDate
    ? new Date(booking.eventDate).toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
        <CardTitle className="text-lg font-semibold text-[#111827] flex items-center gap-2">
          <Music className="w-5 h-5 text-gray-400" />
          Event Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border-b border-gray-100">
            <div className="p-5 space-y-1">
              <p className="text-[#6B7280] uppercase tracking-wider text-[11px] font-bold">
                Event Type
              </p>
              <p className="font-semibold text-[#111827] capitalize">
                {booking.eventType || 'N/A'}
              </p>
            </div>
            <div className="p-5 space-y-1">
              <p className="text-[#6B7280] uppercase tracking-wider text-[11px] font-bold">
                Date & Time
              </p>
              <p className="font-semibold text-[#111827]">{eventDateFormatted}</p>
              {startTime && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[12px] font-bold border border-amber-200 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  {startTime}
                </div>
              )}
            </div>
            <div className="p-5 space-y-1">
              <p className="text-[#6B7280] uppercase tracking-wider text-[11px] font-bold">
                Duration
              </p>
              <p className="font-semibold text-[#111827]">{duration || 'Custom Set'}</p>
            </div>
          </div>

          <div className="p-5 space-y-1 bg-gray-50/30 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-[#6B7280] uppercase tracking-wider text-[11px] font-bold">
                Venue & Location
              </p>
              {booking.address && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {booking.address}
                </a>
              )}
            </div>
            <p className="font-medium text-[#111827] flex items-start gap-2 pt-1">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              {booking.address || 'Location not specified'}
            </p>
          </div>

          {requirements && (
            <div className="p-5 space-y-2">
              <p className="text-[#6B7280] uppercase tracking-wider text-[11px] font-bold">
                Client Requirements & Music Expectations
              </p>
              <div className="text-[14px] text-[#374151] whitespace-pre-wrap leading-relaxed bg-[#F9FAFB] p-4 rounded-xl border border-gray-100">
                {requirements}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
