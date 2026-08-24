'use client';

import { Footer } from '@repo/ui';
import { useGetLandingPageContentQuery } from '@repo/store';

export function DynamicFooter() {
  const { data: response } = useGetLandingPageContentQuery();
  const socials = response?.data?.socials || [];
  const footerLogoUrl = response?.data?.settings?.footerLogoUrl || undefined;

  return <Footer socials={socials} logoUrl={footerLogoUrl} />;
}

