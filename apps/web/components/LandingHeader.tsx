'use client';

import React from 'react';
import { Header } from '@repo/ui';
import { useGetCurrentProfileQuery } from '@repo/store';
import { UserDropdown } from './shared/UserDropdown';

export function LandingHeader() {
  const { data: profileResponse, isLoading } = useGetCurrentProfileQuery();
  const user = profileResponse?.data;

  // While loading, we can just render the standard Header 
  // or a version without the login button to prevent flashing.
  // We'll pass the UserDropdown only if user is logged in.

  return (
    <Header 
      userDropdown={user && !isLoading ? <UserDropdown /> : undefined}
    />
  );
}
