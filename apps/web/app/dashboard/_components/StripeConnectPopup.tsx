'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button
} from '@repo/ui';
import { useGetCurrentProfileQuery, useCheckAccountStatusQuery } from '@repo/store';

export function StripeConnectPopup() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Get tenant info
  const { data: profileResponse, isLoading: isLoadingProfile } = useGetCurrentProfileQuery();
  const tenantId = profileResponse?.data?.tenant?.id;

  // Check stripe status
  const { data: statusResponse, isLoading: isLoadingStatus } = useCheckAccountStatusQuery(tenantId || '', {
    skip: !tenantId,
  });

  useEffect(() => {
    if (!isLoadingProfile && !isLoadingStatus && statusResponse?.data) {
      const { isConnected, detailsSubmitted } = statusResponse.data;
      if (!isConnected || !detailsSubmitted) {
        // Check session storage so we don't annoy them if they dismissed it in this session
        const hasDismissed = sessionStorage.getItem('stripePopupDismissed');
        if (!hasDismissed) {
          setOpen(true);
        }
      }
    }
  }, [isLoadingProfile, isLoadingStatus, statusResponse]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      sessionStorage.setItem('stripePopupDismissed', 'true');
    }
  };

  const handleConnectClick = () => {
    setOpen(false);
    sessionStorage.setItem('stripePopupDismissed', 'true');
    router.push('/dashboard/billing');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">Set up Payouts</DialogTitle>
          <DialogDescription className="text-center text-gray-500 pt-2">
            Connect your payment method to receive payments from client bookings directly to your bank account. Without a payment method, you won't be able to receive payouts for your paid bookings.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-2 pt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Later
          </Button>
          <Button onClick={handleConnectClick} className="bg-primary text-white hover:bg-primary/90">
            Add Payment Method
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
