'use client';

import {useState} from 'react';
import {Plus} from 'lucide-react';
import {Button} from '@repo/ui';
import {MixTapeCard} from './MixTapeCard'; /* TS fix */
import CreateMixTape from './CreateMixTape'; /* TS fix */
import { useGetTenantMixTapesQuery, useDeleteMixTapeMutation, useGetCurrentProfileQuery } from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { toast } from 'sonner';
import { MixTape } from '@repo/store';

export default function MixTapesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [mixtapeToEdit, setMixtapeToEdit] = useState<MixTape | null>(null);
  const [mixtapeToDelete, setMixtapeToDelete] = useState<string | null>(null);

  const { data: profile } = useGetCurrentProfileQuery();
  const tenantId = profile?.data?.tenant?.id;
  const { data: mixtapesResponse, isLoading: isMixtapesLoading } = useGetTenantMixTapesQuery(tenantId as string, {
    skip: !tenantId
  });
  const [deleteMixTape, { isLoading: isDeleting }] = useDeleteMixTapeMutation();

  const mixtapes = mixtapesResponse?.data || [];

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
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to delete mixtape');
    }
  };

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen p-4 md:p-2">
      <div className="mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Section */}
        <div className="flex flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-[28px] font-bold tracking-tight text-[#111620]">
              MixTapes
            </h1>
            <p className="text-[#787878] text-[15px]">
              {mixtapes.length} mixtape{mixtapes.length !== 1 ? 's' : ''} uploaded
            </p>
          </div>

          <Button
            onClick={() => {
              setMixtapeToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 h-11 rounded-lg shadow-sm cursor-pointer transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4 mr-2 stroke-[2.5]" />
            Add MixTape
          </Button>
        </div>

        {/* Content Section */}
        {isMixtapesLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : mixtapes.length > 0 ? (
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
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50">
            <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-[#111620] mb-2">No MixTapes Found</h3>
            <p className="text-[#787878] text-center max-w-sm mb-6">
              You haven't added any MixTapes yet. Upload your first audio mix to showcase on your profile.
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
