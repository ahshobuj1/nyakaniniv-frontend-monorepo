/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {useState, useEffect} from 'react';
import {Plus} from 'lucide-react';
import {Button, ListHeaderControls, PaginationControls} from '@repo/ui';
import {MixTapeCard} from './MixTapeCard';
import CreateMixTape from './CreateMixTape';
import {
  useGetTenantMixTapesQuery,
  useDeleteMixTapeMutation,
  useGetCurrentProfileQuery,
  MixTape,
} from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import {ConfirmationDialog} from '@/components/ConfirmationDialog';
import {toast} from 'sonner';

export default function MixTapesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [mixtapeToEdit, setMixtapeToEdit] = useState<MixTape | null>(null);
  const [mixtapeToDelete, setMixtapeToDelete] = useState<string | null>(null);

  // --- Search, Sort & Pagination State ---
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
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

  const sortOptions = [
    {value: 'order', label: 'Display Order'},
    {value: 'createdAt', label: 'Date Added'},
    {value: 'title', label: 'Title'},
  ];

  const queryParams: Record<string, any> = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  };
  if (debouncedSearch.trim()) queryParams.search = debouncedSearch.trim();
  if (sort) queryParams.sortBy = sort;
  if (sortOrder) queryParams.sortOrder = sortOrder;

  const {data: profile} = useGetCurrentProfileQuery();
  const tenantId = profile?.data?.tenant?.id;

  const {data: mixtapesResponse, isLoading: isMixtapesLoading} =
    useGetTenantMixTapesQuery(
      tenantId ? {tenantId, params: queryParams} : ('' as any),
      {
        skip: !tenantId,
      },
    );
  const [deleteMixTape, {isLoading: isDeleting}] = useDeleteMixTapeMutation();

  const mixtapes = mixtapesResponse?.data || [];
  const paginationMeta =
    (mixtapesResponse as any)?.meta?.pagination ||
    (mixtapesResponse as any)?.meta;
  const totalRows = paginationMeta?.total ?? mixtapes.length;
  const totalPages =
    paginationMeta?.totalPages ??
    Math.max(1, Math.ceil(totalRows / pagination.pageSize));

  const handleEdit = (id: string) => {
    const mx = mixtapes.find((m) => m.id === id);
    if (mx) {
      setMixtapeToEdit(mx);
      setIsAddModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setMixtapeToDelete(id);
  };

  const confirmDelete = async () => {
    if (!mixtapeToDelete) return;
    try {
      await deleteMixTape(mixtapeToDelete).unwrap();
      toast.success('MixTape deleted successfully!');
      setMixtapeToDelete(null);
    } catch (error: any) {
      toast.error(
        error?.data?.error?.message ||
          error?.data?.message ||
          'Failed to delete mixtape',
      );
    }
  };

  return (
    <div className="w-full bg-[#F5F5F5] p-4 md:p-2">
      <div className="mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ListHeaderControls
          title="MixTapes"
          description={`Upload and manage your DJ mixtapes and audio sets (${totalRows} total uploaded).`}
          search={search}
          setSearch={setSearch}
          searchPlaceholder="Search mixtapes by title..."
          sort={sort}
          onSort={handleSort}
          sortOrder={sortOrder}
          onSortOrder={handleSortOrder}
          sortOptions={sortOptions}>
          <Button
            onClick={() => {
              setMixtapeToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-4 h-9 rounded-md shadow-xs cursor-pointer transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            Add MixTape
          </Button>
        </ListHeaderControls>

        {/* Content Section */}
        {isMixtapesLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : mixtapes.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mixtapes.map((mixtape) => (
                <MixTapeCard
                  key={mixtape.id}
                  mixtape={mixtape}
                  onEdit={() => handleEdit(mixtape.id)}
                  onDelete={() => handleDelete(mixtape.id)}
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
          <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50">
            <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-[#111620] mb-2">
              No MixTapes Found
            </h3>
            <p className="text-[#787878] text-center max-w-sm mb-6">
              {debouncedSearch
                ? `No mixtapes matched "${debouncedSearch}". Try a different keyword.`
                : "You haven't added any MixTapes yet. Upload your first audio mix to showcase on your profile."}
            </p>
            <Button
              onClick={() => {
                setMixtapeToEdit(null);
                setIsAddModalOpen(true);
              }}
              className="bg-primary hover:bg-primary/90 text-white font-semibold">
              <Plus className="w-4 h-4 mr-2 stroke-[2.5]" />
              Add MixTape
            </Button>
          </div>
        )}
      </div>

      <CreateMixTape
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        mixtapeToEdit={mixtapeToEdit}
      />

      <ConfirmationDialog
        isOpen={!!mixtapeToDelete}
        onCancel={() => setMixtapeToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete MixTape"
        description="Are you sure you want to delete this MixTape? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
