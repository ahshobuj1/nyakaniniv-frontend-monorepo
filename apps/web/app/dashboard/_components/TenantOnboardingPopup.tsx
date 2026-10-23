'use client';

import {useState} from 'react';

import {User} from 'lucide-react';
import {toast} from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
} from '@repo/ui';
import {useGetCurrentProfileQuery, useOnboardTenantMutation} from '@repo/store';
import {ApiErrorResponse} from '@/types/api.types';

export function TenantOnboardingPopup() {
  const [stageName, setStageName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [isDismissed, setIsDismissed] = useState(false);

  const {
    data: profileResponse,
    isLoading,
    refetch,
  } = useGetCurrentProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createTenant, {isLoading: isCreating}] = useOnboardTenantMutation();

  // Derived state: open dialog if DJ is missing a tenant profile and not dismissed
  const user = profileResponse?.data;
  const isMissingTenant = !isLoading && user?.role === 'DJ' && !user?.tenant;
  const isOpen = isMissingTenant && !isDismissed;

  // Make subdomain strictly lowercase, alphanumeric and hyphens
  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageName || !subdomain) {
      toast.error('Both Stage Name and Subdomain are required.');
      return;
    }

    if (subdomain.length < 2) {
      toast.error('Subdomain must be at least 2 characters.');
      return;
    }

    try {
      await createTenant({
        stageName,
        subdomain,
        country: 'Kenya', // default since we want a fast onboarding
        city: 'Nairobi',
        genres: [],
      }).unwrap();

      toast.success('Profile created successfully!');
      setIsDismissed(true);
      refetch();

      // Force reload so that the layout context and navigation updates correctly with the new tenant
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: unknown) {
      const err = error as ApiErrorResponse;
      const errorMsg =
        err?.data?.error?.message ||
        err?.data?.message ||
        'Failed to create profile. Subdomain might be taken.';

      if (errorMsg.toLowerCase().includes('already has a tenant')) {
        toast.success('Tenant profile verified!');
        setIsDismissed(true);
        refetch();
        setTimeout(() => {
          window.location.reload();
        }, 400);
        return;
      }

      toast.error(errorMsg);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsDismissed(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <User className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl">
              Complete Your Profile
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500 pt-2">
              Before you can access the dashboard, choose your professional
              Stage Name and your unique booking website link (Subdomain).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="stageName">
                DJ / Stage Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stageName"
                placeholder="e.g. DJ Alex"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                required
              />
              <p className="text-xs text-gray-400">
                Your professional DJ or artist name shown to booking clients.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdomain">
                Subdomain (Website URL) <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="subdomain"
                  placeholder="dj-alex"
                  value={subdomain}
                  onChange={handleSubdomainChange}
                  className="flex-1"
                  required
                />
                <span className="text-gray-500 text-sm hidden sm:inline-block">
                  .deejay.africa
                </span>
              </div>
              <p className="text-xs text-gray-400">
                This will be your permanent public booking website link.
              </p>
            </div>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button
              type="submit"
              disabled={isCreating}
              className="w-full bg-primary text-white hover:bg-primary/90">
              {isCreating ? 'Saving...' : 'Save & Continue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
