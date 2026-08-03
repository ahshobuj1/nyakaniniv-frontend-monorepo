'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label
} from '@repo/ui';
import { useGetCurrentProfileQuery, useOnboardTenantMutation } from '@repo/store';

export function TenantOnboardingPopup() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  const [stageName, setStageName] = useState('');
  const [subdomain, setSubdomain] = useState('');

  const { data: profileResponse, isLoading, refetch } = useGetCurrentProfileQuery();
  const [createTenant, { isLoading: isCreating }] = useOnboardTenantMutation();

  useEffect(() => {
    if (!isLoading && profileResponse?.data) {
      const user = profileResponse.data;
      // If they are a DJ but don't have a tenant profile
      if (user.role === 'DJ' && !user.tenant) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
  }, [isLoading, profileResponse]);

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
    
    try {
      await createTenant({
        stageName,
        subdomain,
        country: 'Kenya', // default since we want a fast onboarding
        city: 'Nairobi',
        genres: []
      }).unwrap();
      
      toast.success('Profile created successfully!');
      setOpen(false);
      refetch();
      
      // Force reload so that the layout context and navigation updates correctly with the new tenant
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to create profile. Subdomain might be taken.');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    // Prevent manual closing. The only way out is successfully submitting.
    if (newOpen) {
      setOpen(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-md" 
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <User className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl">Complete Your Profile</DialogTitle>
            <DialogDescription className="text-center text-gray-500 pt-2">
              Before you can access the dashboard, you must choose your Stage Name and your unique booking website link (Subdomain).
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="stageName">Stage Name <span className="text-red-500">*</span></Label>
              <Input 
                id="stageName" 
                placeholder="e.g. DJ Alex" 
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain (Website URL) <span className="text-red-500">*</span></Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="subdomain" 
                  placeholder="dj-alex" 
                  value={subdomain}
                  onChange={handleSubdomainChange}
                  className="flex-1"
                  required
                />
                <span className="text-gray-500 text-sm hidden sm:inline-block">.deejay.frica</span>
              </div>
              <p className="text-xs text-gray-400">This will be your permanent public booking link.</p>
            </div>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button type="submit" disabled={isCreating} className="w-full bg-primary text-white hover:bg-primary/90">
              {isCreating ? 'Saving...' : 'Save & Continue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
