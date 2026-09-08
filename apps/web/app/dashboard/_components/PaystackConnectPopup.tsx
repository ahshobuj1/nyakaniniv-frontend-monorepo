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
import { useGetCurrentProfileQuery, useCheckPaystackAccountStatusQuery } from '@repo/store';

export function PaystackConnectPopup() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Get tenant info
  const { data: profileResponse, isLoading: isLoadingProfile } = useGetCurrentProfileQuery();
  const tenant = profileResponse?.data?.tenant;
  const tenantId = tenant?.id;
  const tenantCountry = (tenant?.country || '').trim().toLowerCase();
  const isEastAfrica = ['tanzania', 'tz', 'kenya', 'ke', 'uganda', 'ug', 'rwanda', 'rw'].includes(tenantCountry);

  // Check payout connection status
  const { data: statusResponse, isLoading: isLoadingStatus } = useCheckPaystackAccountStatusQuery(tenantId || '', {
    skip: !tenantId,
  });

  useEffect(() => {
    // Only show for DJs
    if (profileResponse?.data?.role !== 'DJ') return;

    if (!isLoadingProfile && !isLoadingStatus && statusResponse?.data) {
      const { isConnected } = statusResponse.data;
      if (!isConnected) {
        // Check session storage so we don't annoy them if they dismissed it in this session
        const hasDismissed = sessionStorage.getItem(`paystackPopupDismissed_${tenantId}`);
        if (!hasDismissed) {
          setOpen(true);
        }
      }
    }
  }, [isLoadingProfile, isLoadingStatus, statusResponse, tenantId]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && tenantId) {
      sessionStorage.setItem(`paystackPopupDismissed_${tenantId}`, 'true');
    }
  };

  const handleConnectClick = () => {
    setOpen(false);
    if (tenantId) {
      sessionStorage.setItem(`paystackPopupDismissed_${tenantId}`, 'true');
    }
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
            {isEastAfrica 
              ? "Connect your Mobile Money (M-Pesa, Tigo Pesa, Airtel Money) or bank account to receive booking payments directly. Without a payout method, you won't be able to receive payouts for your bookings."
              : "Connect your bank account to receive payments from client bookings directly. Without a payout method, you won't be able to receive payouts for your paid bookings."
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-2 pt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Later
          </Button>
          <Button onClick={handleConnectClick} className="bg-primary text-white hover:bg-primary/90">
            Set Up Payouts
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
