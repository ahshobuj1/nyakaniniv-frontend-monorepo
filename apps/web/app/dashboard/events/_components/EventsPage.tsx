'use client';

import {useState} from 'react';
import {Plus} from 'lucide-react';
import {Button} from '@repo/ui';
import {Badge} from '@repo/ui';
import {EventData} from '@repo/types';
import {EventCard} from './EventCard';
import AddEventModal from './CreateEvent';

const dummyEvents: EventData[] = [
  {
    id: '1',
    title: 'Afrobeats Takeover',
    date: 'Fri, 15 Nov 2024',
    location: 'Bloom Bar, Accra, Ghana',
    capacity: 500,
    price: 80,
    currencySymbol: '₵',
    description: 'A night of pure Afrobeats and Amapiano vibes',
    image: '/event/event.jpg', // Replace with your actual image paths
    status: 'Upcoming',
  },
  {
    id: '2',
    title: 'Techno Night Extravaganza',
    date: 'Sat, 20 Dec 2024',
    location: 'The Warehouse, Berlin, Germany',
    capacity: 1000,
    price: 40,
    currencySymbol: '€',
    description: 'Immerse yourself in the beats of the undergr...',
    image: '/event/event.jpg',
    status: 'Completed',
  },
  {
    id: '3',
    title: 'Jazz & Blues Festival',
    date: 'Sun, 25 Aug 2024',
    location: 'City Park, New Orleans, USA',
    capacity: 2000,
    price: 60,
    currencySymbol: '$',
    description: 'Celebrating soulful tunes from iconic artists',
    image: '/event/event.jpg',
    status: 'Completed',
  },
  {
    id: '4',
    title: 'Indie Music Showcase',
    date: 'Thu, 10 Oct 2024',
    location: 'The Loft, Toronto, Canada',
    capacity: 300,
    price: 30,
    currencySymbol: 'CAD ',
    description: 'Discover the next big names in indie music',
    image: '/event/event.jpg',
    status: 'Upcoming',
  },
  {
    id: '5',
    title: 'Classical Evening Gala',
    date: 'Sat, 5 Jan 2025',
    location: 'Royal Opera House, London, UK',
    capacity: 1500,
    price: 100,
    currencySymbol: '£',
    description: 'An exquisite night featuring renowned orches...',
    image: '/event/event.jpg',
    status: 'Upcoming',
  },
  {
    id: '6',
    title: 'Tech Innovation Summit',
    date: 'Mon, 12 Mar 2025',
    location: 'Silicon Valley Conference Center, C...',
    capacity: 2000,
    price: 250,
    currencySymbol: '£',
    description: 'Showcasing groundbreaking advancements...',
    image: '/event/event.jpg',
    status: 'Completed',
  },
  {
    id: '7',
    title: 'Artistic Expressions Exhibition',
    date: 'Fri, 21 Apr 2025',
    location: 'Metropolitan Museum, New York, USA',
    capacity: 1000,
    price: 75,
    currencySymbol: '£',
    description: 'A celebration of contemporary art and creati...',
    image: '/event/event.jpg',
    status: 'Upcoming',
  },
];

// ==========================================
// 4. Main Page Component
// ==========================================
type FilterType = 'All' | 'Upcoming' | 'Completed';

export default function EventsPage() {
  const [filter, setFilter] = useState<FilterType>('All');
  const [events, setEvents] = useState<EventData[]>(dummyEvents);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Derived state
  const upcomingCount = events.filter((e) => e.status === 'Upcoming').length;
  const completedCount = events.filter((e) => e.status === 'Completed').length;

  const filteredEvents = events.filter((event) => {
    if (filter === 'All') return true;
    return event.status === filter;
  });

  // Handlers
  const handleEdit = (id: string) => {
    console.log('Edit event:', id);
    // Add edit logic here
  };

  const handleDelete = (id: string) => {
    console.log('Delete event:', id);
    // Add delete confirmation & logic here
    // setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen">
      <div className="mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-[28px] font-bold tracking-tight text-[#111620]">
              Events
            </h1>
            <p className="text-[#787878] text-[15px]">
              {upcomingCount} upcoming · {completedCount} completed
            </p>
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 h-11 rounded-lg shadow-sm cursor-pointer transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4 mr-2 stroke-[2.5]" />
            Add Event
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(['All', 'Upcoming', 'Completed'] as FilterType[]).map((f) => {
            const isActive = filter === f;
            return (
              <Badge
                key={f}
                variant="outline"
                className={`
                  cursor-pointer text-[14px] py-2 px-5 font-medium transition-all duration-200 rounded-full border
                  ${
                    isActive
                      ? 'bg-white border-primary text-primary shadow-sm'
                      : 'bg-[#E5E7EB] border-transparent text-[#787878] hover:bg-gray-200'
                  }
                `}
                onClick={() => setFilter(f)}>
                {f}
              </Badge>
            );
          })}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No events found for the selected filter.
          </div>
        )}
      </div>

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
