import {Event} from '@repo/store';
import {Button, Card, CardContent} from '@repo/ui';
import {Calendar, Clock, MapPin, Ticket, Trash2, Users} from 'lucide-react';
import Image from 'next/image';

interface EventCardProps {
  event: Event;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EventCard({event, onEdit, onDelete}: EventCardProps) {
  const eventDateObj = event.eventDate ? new Date(event.eventDate) : null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isPast = event.status?.toLowerCase() === 'completed' || (eventDateObj && eventDateObj < today);

  let statusText = 'Upcoming';
  let statusColor = 'border-[#10B981] text-[#10B981]'; // Green

  if (event.status?.toLowerCase() === 'canceled') {
    statusText = 'Canceled';
    statusColor = 'border-red-500 text-red-500'; // Red
  } else if (isPast) {
    statusText = 'Completed';
    statusColor = 'border-blue-500 text-blue-500'; // Blue
  }

  const dateFormatted = eventDateObj 
    ? eventDateObj.toLocaleDateString('en-US', {
        timeZone: 'Africa/Nairobi',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) 
    : 'N/A';

  const timeFormatted = event.eventTime || (eventDateObj && typeof event.eventDate === 'string' && event.eventDate.includes('T') && !event.eventDate.endsWith('T00:00:00.000Z')
    ? eventDateObj.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit' })
    : null);

  const location = [event.venueName, event.venueAddress].filter(Boolean).join(', ') || 'No location';

  return (
    <Card className="p-0 border border-gray-200 shadow-sm overflow-hidden flex flex-col rounded-2xl bg-white transition-all hover:shadow-md relative">
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span
          className={`
            px-2.5 py-1 text-[11px] font-semibold rounded-[6px] border bg-white capitalize shadow-sm
            ${statusColor}
          `}>
          {statusText}
        </span>
      </div>

      {/* Content Container */}
      <CardContent className="pt-5 px-5 pb-5 flex flex-col grow">
        <h3 className="text-[17px] font-bold text-[#111620] mb-3 line-clamp-1 pr-20">
          {event.title || 'Untitled Event'}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-[#787878] text-[13px] gap-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400 stroke-[1.5]" />
              {dateFormatted}
            </div>
            {timeFormatted && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-gray-400 stroke-[1.5]" />
                {timeFormatted.includes('EAT') ? timeFormatted : `${timeFormatted} EAT`}
              </div>
            )}
          </div>
          <div className="flex items-center text-[#787878] text-[13px]">
            <MapPin className="w-4 h-4 mr-2 text-gray-400 stroke-[1.5]" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center text-[#787878] text-[13px] gap-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-gray-400 stroke-[1.5]" />
              {event.capacity || 0} cap.
            </div>
            <div className="flex items-center">
              <Ticket className="w-4 h-4 mr-2 text-gray-400 stroke-[1.5]" />
              {Number(event.price) > 0 ? `KES ${Number(event.price).toLocaleString()}` : 'Free'}
            </div>
          </div>
        </div>

        <p className="text-[13px] text-[#111620] font-medium mb-5 line-clamp-2">
          {event.description || 'No description provided.'}
        </p>

        <div className="mt-auto flex items-center gap-2">
          <Button
            variant="secondary"
            className="grow bg-[#F5F5F5] hover:bg-[#E5E7EB] text-[#111620] font-semibold h-10.5 rounded-lg transition-colors"
            onClick={() => onEdit(event.id)}>
            Edit
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-[#F5F5F5] hover:bg-red-50 hover:text-red-600 text-gray-500 h-10.5 w-10.5 rounded-lg transition-colors shrink-0"
            onClick={() => onDelete(event.id)}>
            <Trash2 className="w-4.5 h-4.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
