'use client';

import React from 'react';
import { Header } from '@repo/ui';
import { useGetCurrentProfileQuery, useGetLandingPageContentQuery } from '@repo/store';
import { UserDropdown } from './shared/UserDropdown';

export function LandingHeader() {
  const { data: profileResponse, isLoading } = useGetCurrentProfileQuery();
  const { data: landingResponse } = useGetLandingPageContentQuery();
  
  const user = profileResponse?.data;
  const headerLogoUrl = landingResponse?.data?.settings?.headerLogoUrl || undefined;

  return (
    <Header 
      userDropdown={user && !isLoading ? <UserDropdown /> : undefined}
      logoUrl={headerLogoUrl}
    />
  );
}

