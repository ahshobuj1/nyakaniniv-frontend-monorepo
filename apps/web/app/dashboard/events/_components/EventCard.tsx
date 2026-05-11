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
    <Card className="border-none shadow-sm overflow-hidden flex flex-col rounded-2xl bg-white transition-all hover:shadow-md">
      {/* Image & Badge Container */}
      <div className="relative w-full aspect-video bg-gray-100">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          // Using a fallback unstyled div for dummy rendering if image is missing
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* If image fails to load or no image, a fallback background */}
        <div className="absolute inset-0 bg-linear-to-tr from-slate-800 to-slate-600 -z-10 flex items-center justify-center text-white/20">
          No Image
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`
              px-3 py-1 text-xs font-medium rounded-md border bg-black/60 backdrop-blur-md
              ${isUpcoming ? 'border-primary text-primary' : 'border-emerald-500 text-emerald-500'}
            `}>
            {event.status}
          </span>
        </div>
      </div>

      <CardContent className="p-5 flex flex-col grow">
        <h3 className="text-[17px] font-bold text-[#111620] mb-3 line-clamp-1">
          {event.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-[#787878] text-[13px]">
            <Calendar className="w-4 h-4 mr-2.5 stroke-[1.5]" />
            {event.date}
          </div>
          <div className="flex items-center text-[#787878] text-[13px]">
            <MapPin className="w-4 h-4 mr-2.5 stroke-[1.5]" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center text-[#787878] text-[13px] gap-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 stroke-[1.5]" />
              {event.capacity} cap.
            </div>
            <div className="flex items-center">
              <Ticket className="w-4 h-4 mr-2 stroke-[1.5]" />
              {event.currencySymbol}
              {event.price}
            </div>
          </div>
        </div>

        <p className="text-[13px] text-[#111620] mb-5 line-clamp-1 font-medium">
          {event.description}
        </p>

        <div className="mt-auto flex items-center gap-2">
          <Button
            variant="secondary"
            className="grow bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#111620] font-semibold h-10.5 rounded-lg transition-colors"
            onClick={() => onEdit(event.id)}>
            Edit
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-[#E5E7EB] hover:bg-red-100 hover:text-red-600 text-gray-500 h-10.5 w-10.5 rounded-lg transition-colors shrink-0"
            onClick={() => onDelete(event.id)}>
            <Trash2 className="w-4.5 h-4.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
