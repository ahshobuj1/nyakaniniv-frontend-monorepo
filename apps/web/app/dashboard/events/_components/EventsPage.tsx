/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {useState, useEffect} from 'react';
import {Plus} from 'lucide-react';
import {Button, ListHeaderControls, PaginationControls} from '@repo/ui';
import {EventCard} from './EventCard';
import AddEventModal from './CreateEvent';
import {
  useGetTenantEventsQuery,
  useGetCurrentProfileQuery,
  useDeleteEventMutation,
} from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import {ConfirmationDialog} from '@/components/ConfirmationDialog';
import {toast} from 'sonner';

type FilterType = 'All' | 'upcoming' | 'completed' | 'canceled';

export default function EventsPage() {
  const [filter, setFilter] = useState<FilterType>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<any>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  // --- Search, Sort & Pagination State ---
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('eventDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 12,
  });

  // Debounce search input by 400ms (industry standard best practice)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({...prev, pageIndex: 0}));
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSort = (value: string) => {
    setSort(value);
    setPagination((prev) => ({...prev, pageIndex: 0}));
  };

  const handleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPagination((prev) => ({...prev, pageIndex: 0}));
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setPagination((prev) => ({...prev, pageIndex: 0}));
  };

  const statusFilterOptions = [
    {value: 'All', label: 'All Events'},
    {value: 'upcoming', label: 'Upcoming'},
    {value: 'completed', label: 'Completed'},
    {value: 'canceled', label: 'Canceled'},
  ];

  const sortOptions = [
    {value: 'eventDate', label: 'Event Date'},
    {value: 'createdAt', label: 'Date Created'},
    {value: 'title', label: 'Event Title'},
    {value: 'price', label: 'Ticket Price'},
  ];

  const queryParams: Record<string, any> = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  };
  if (debouncedSearch.trim()) queryParams.search = debouncedSearch.trim();
  if (sort) queryParams.sortBy = sort;
  if (sortOrder) queryParams.sortOrder = sortOrder;
  if (filter !== 'All') queryParams.status = filter;

  // APIs
  const {data: profileResponse} = useGetCurrentProfileQuery();
  const tenantId = profileResponse?.data?.tenant?.id;

  const {data: eventsResponse, isLoading: isEventsLoading} =
    useGetTenantEventsQuery(
      tenantId ? {tenantId, params: queryParams} : ('' as any),
      {
        skip: !tenantId,
      },
    );

  const [deleteEvent, {isLoading: isDeleting}] = useDeleteEventMutation();

  const events = eventsResponse?.data || [];
  const paginationMeta =
    (eventsResponse as any)?.meta?.pagination || (eventsResponse as any)?.meta;
  const totalRows = paginationMeta?.total ?? events.length;
  const totalPages =
    paginationMeta?.totalPages ??
    Math.max(1, Math.ceil(totalRows / pagination.pageSize));

  // Handlers
  const handleEdit = (id: string) => {
    const ev = events.find((e: any) => e.id === id);
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
      toast.error(
        error?.data?.error?.message ||
          error?.data?.message ||
          'Failed to delete event',
      );
    }
  };

  return (
    <div className="w-full bg-[#F5F5F5] p-4 md:p-2">
      <div className="mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ListHeaderControls
          title="Events"
          description={`Create and organize your upcoming DJ gigs, ticketed events, and performances (${totalRows} total).`}
          search={search}
          setSearch={setSearch}
          searchPlaceholder="Search events by title, venue..."
          filter={filter}
          onFilter={(v) => handleFilterChange(v as FilterType)}
          filterOptions={statusFilterOptions}
          filterPlaceholder="All Events"
          sort={sort}
          onSort={handleSort}
          sortOrder={sortOrder}
          onSortOrder={handleSortOrder}
          sortOptions={sortOptions}>
          <Button
            onClick={() => {
              setEventToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-4 h-9 rounded-md shadow-xs cursor-pointer transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            Add Event
          </Button>
        </ListHeaderControls>

        {/* Events Grid Section */}
        {isEventsLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event: any) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {totalRows > 10 && (
              <div className="border border-gray-200 rounded-sm bg-white shadow-xs">
                <PaginationControls
                  pagination={pagination}
                  onPaginationChange={setPagination}
                  totalPages={totalPages}
                  totalRows={totalRows}
                  pageSizeOptions={[8, 12, 24, 48]}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-white border border-gray-200 rounded-sm shadow-xs">
            {debouncedSearch
              ? `No events found matching "${debouncedSearch}".`
              : 'No events found for the selected filter.'}
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
