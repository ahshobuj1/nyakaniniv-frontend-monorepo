'use client';

import React from 'react';
import Link from 'next/link';
import {usePathname, useSearchParams} from 'next/navigation';

export default function Navbar({content, view, onViewChange}: any) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPreviewPage = pathname?.includes('/themes/preview');
  const themeId = searchParams?.get('themeId');
  
  const handleBookingClick = (e: React.MouseEvent) => {
    if (onViewChange) {
      e.preventDefault();
      onViewChange('booking');
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (onViewChange) {
      e.preventDefault();
      onViewChange('landing');
    }
  };

  const bookingLink = isPreviewPage 
    ? `/themes/preview?themeId=${themeId}&view=booking` 
    : '/book';

  const homeLink = isPreviewPage 
    ? `/themes/preview?themeId=${themeId}&view=landing` 
    : '/';

  return (
    <nav className="h-24 px-10 flex items-center justify-between border-b border-white/10 bg-black text-white">
      <Link href={homeLink} onClick={handleHomeClick} className="text-2xl font-black tracking-tighter uppercase italic">
        {content?.djName || 'KENZO'}
      </Link>
      
      <div className="flex items-center gap-8">
        <Link 
          href={bookingLink} 
          onClick={handleBookingClick}
          className="text-xs font-bold tracking-widest uppercase border border-white/20 px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-all"
        >
          Book Now
        </Link>
      </div>
    </nav>
  );
}
