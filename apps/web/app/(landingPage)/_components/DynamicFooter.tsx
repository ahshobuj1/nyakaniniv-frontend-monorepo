'use client';

import { Footer } from '@repo/ui';
import { useGetLandingPageContentQuery } from '@repo/store';

export function DynamicFooter() {
  const { data: response } = useGetLandingPageContentQuery();
  const socials = response?.data?.socials || [];

  return <Footer socials={socials} />;
}
