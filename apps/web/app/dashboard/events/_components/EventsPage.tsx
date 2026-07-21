'use client';

import {useState} from 'react';
import {Plus} from 'lucide-react';
import {Button} from '@repo/ui';
import {Badge} from '@repo/ui';
import {EventCard} from './EventCard';
import AddEventModal from './CreateEvent';
import { useGetTenantEventsQuery, useGetCurrentProfileQuery, useDeleteEventMutation } from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { toast } from 'sonner';

type FilterType = 'All' | 'Upcoming' | 'Completed';

export default function EventsPage() {
  const [filter, setFilter] = useState<FilterType>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Modal state for Edit
  const [eventToEdit, setEventToEdit] = useState<any>(null); // pass to CreateEvent later

  // Modal state for Delete
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  // APIs
  const { data: profileResponse } = useGetCurrentProfileQuery();
  const tenantId = profileResponse?.data?.tenant?.id;

  const { data: eventsResponse, isLoading: isEventsLoading } = useGetTenantEventsQuery(tenantId || '', {
    skip: !tenantId,
  });
  
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const events = eventsResponse?.data || [];

  // Derived state
  const upcomingCount = events.filter((e) => e.status?.toLowerCase() === 'upcoming').length;
  const completedCount = events.filter((e) => e.status?.toLowerCase() === 'completed').length;

  const filteredEvents = events.filter((event) => {
    if (filter === 'All') return true;
    return event.status?.toLowerCase() === filter.toLowerCase();
  });

  // Handlers
  const handleEdit = (id: string) => {
    const ev = events.find((e) => e.id === id);
    if (ev) {
      setEventToEdit(ev);
      setIsAddModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setEventToDelete(id);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      await deleteEvent(eventToDelete).unwrap();
      toast.success('Event deleted successfully!');
      setEventToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen">
      <div className="mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Section */}
        <div className="flex flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-[28px] font-bold tracking-tight text-[#111620]">
              Events
            </h1>
            <p className="text-[#787878] text-[15px]">
              {upcomingCount} upcoming · {completedCount} completed
            </p>
          </div>

          <Button
            onClick={() => {
              setEventToEdit(null);
              setIsAddModalOpen(true);
            }}
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
                  cursor-pointer text-[14px] px-3 md:px-5 py-1 md:py-2.5 rounded-md md:rounded-full font-medium transition-all duration-200  border
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
        {isEventsLoading ? (
          <LoadingSpinner />
        ) : (
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
        )}

        {!isEventsLoading && filteredEvents.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No events found for the selected filter.
          </div>
        )}
      </div>

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEventToEdit(null);
        }}
        eventToEdit={eventToEdit}
      />

      <ConfirmationDialog
        isOpen={!!eventToDelete}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        isLoading={isDeleting}
        onCancel={() => setEventToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
