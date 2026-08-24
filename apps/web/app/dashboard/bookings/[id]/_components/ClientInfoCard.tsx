'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { User, Mail, Phone } from 'lucide-react';
import { Booking } from '@repo/store';

interface ClientInfoCardProps {
  booking: Booking;
}

export function ClientInfoCard({ booking }: ClientInfoCardProps) {
  const client = booking.client;

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
        <CardTitle className="text-lg font-semibold text-[#111827] flex items-center gap-2">
          <User className="w-5 h-5 text-gray-400" />
          Client Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-gray-500 uppercase">
              {client?.name?.charAt(0) || 'C'}
            </span>
          </div>
          <div className="overflow-hidden">
            <h3 className="font-semibold text-[#111827] truncate">
              {client?.name || 'Unknown Client'}
            </h3>
            <p className="text-sm text-[#6B7280]">Customer</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            <a
              href={`mailto:${client?.email}`}
              className="text-[#374151] hover:text-blue-600 truncate transition-colors"
            >
              {client?.email || 'No email provided'}
            </a>
          </div>
          {client?.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <a
                href={`tel:${client.phone}`}
                className="text-[#374151] hover:text-blue-600 truncate transition-colors"
              >
                {client.phone}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
