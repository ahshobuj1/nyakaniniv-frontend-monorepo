import {EventData} from '@repo/types';
import {Button, Card, CardContent} from '@repo/ui';
import {Calendar, MapPin, Ticket, Trash2, Users} from 'lucide-react';
import Image from 'next/image';

interface EventCardProps {
  event: EventData;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EventCard({event, onEdit, onDelete}: EventCardProps) {
  const isUpcoming = event.status === 'Upcoming';

  return (
    // FIX: Added 'p-0' here to remove any default padding from the Card component
    <Card className="p-0 border border-gray-200 shadow-sm overflow-hidden flex flex-col rounded-2xl bg-white transition-all hover:shadow-md">
      {/* Image & Badge Container */}
      <div className="relative w-full aspect-video bg-gray-100">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Fallback background */}
        <div className="absolute inset-0 bg-linear-to-tr from-slate-800 to-slate-600 -z-10 flex items-center justify-center text-white/20">
          No Image
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`
              px-2.5 py-1 text-[11px] font-semibold rounded-[6px] border bg-black/90
              ${isUpcoming ? 'border-primary text-primary' : 'border-[#10B981] text-[#10B981]'}
            `}>
            {event.status}
          </span>
        </div>
      </div>

      {/* Content Container */}
      {/* Shadcn er CardContent a onek somoy default pb-6 thake, tai pt-5 px-5 pb-5 use korlam exact spacing er jonno */}
      <CardContent className="pt-5 px-5 pb-5 flex flex-col grow">
        <h3 className="text-[17px] font-bold text-[#111620] mb-3 line-clamp-1">
          {event.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-[#787878] text-[13px]">
            <Calendar className="w-4 h-4 mr-2.5 text-gray-400 stroke-[1.5]" />
            {event.date}
          </div>
          <div className="flex items-center text-[#787878] text-[13px]">
            <MapPin className="w-4 h-4 mr-2.5 text-gray-400 stroke-[1.5]" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center text-[#787878] text-[13px] gap-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2.5 text-gray-400 stroke-[1.5]" />
              {event.capacity} cap.
            </div>
            <div className="flex items-center">
              <Ticket className="w-4 h-4 mr-2.5 text-gray-400 stroke-[1.5]" />
              {event.currencySymbol}
              {event.price}
            </div>
          </div>
        </div>

        <p className="text-[13px] text-[#111620] font-medium mb-5 line-clamp-1">
          {event.description}
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
