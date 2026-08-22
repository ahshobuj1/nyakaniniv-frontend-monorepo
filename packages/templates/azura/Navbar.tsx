'use client';

import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import Link from 'next/link';
import {usePathname, useSearchParams} from 'next/navigation';
import {Logo} from './constants';

export default function Nav({content, view, onViewChange, baseUrl}: any) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPreviewPage = pathname?.includes('/themes/preview');
  const themeId = searchParams?.get('themeId');

  // State to manage mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Logic for internal state change (Editor/Preview mode) or external navigation (Live site)
  const handleBookingClick = (e: React.MouseEvent) => {
    if (onViewChange) {
      e.preventDefault();
      onViewChange('booking');
    }
    setIsMobileMenuOpen(false); // Close mobile menu on click
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (onViewChange) {
      e.preventDefault();
      onViewChange('landing');
    }
    setIsMobileMenuOpen(false); // Close mobile menu on click
  };

  const homeLink = isPreviewPage
    ? `/themes/preview?themeId=${themeId}&view=landing`
    : baseUrl || '/';

  const bookingLink = isPreviewPage
    ? `/themes/preview?themeId=${themeId}&view=booking`
    : baseUrl
      ? `${baseUrl}/book`
      : '/book';

  const links = content?.navLinks || [
    'Home',
    'About',
    'Music',
    'Events',
    'Gallery',
  ];

  return (
    <motion.header
      initial={{y: -40, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1]}}
      // added 'relative' here so the absolute dropdown is positioned relative to the header
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#f0f0f0] relative">
      <div className="max-w-[1440px] mx-auto h-[80px] md:h-[100px] px-6 lg:px-[80px] flex items-center justify-between relative z-50 bg-white/95 backdrop-blur-sm">
        {/* Logo */}
        <Link href={homeLink} onClick={handleHomeClick} className="flex items-center">
          {content?.logo || content?.navbar?.logo ? (
            <img
              src={content?.logo || content?.navbar?.logo}
              alt={content?.djName || content?.navbar?.djName || 'DJ Logo'}
              className="h-14 sm:h-16 md:h-20 w-auto max-w-[260px] md:max-w-[320px] object-contain transition-all"
            />
          ) : (
            <Logo name={content?.djName || content?.navbar?.djName} />
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-[48px]">
          <nav className="flex items-center gap-[40px] font-sans">
            {links.map((l: string, i: number) => (
              <Link
                key={l}
                href={i === 0 ? homeLink : `${homeLink}#${l.toLowerCase()}`}
                onClick={i === 0 ? handleHomeClick : undefined}
                className={`text-[16px] transition-colors ${
                  view === 'landing' && i === 0
                    ? 'bg-[#f0f0f0] text-[var(--primary)] px-[14px] py-[6px] rounded-[28px] font-medium'
                    : 'text-[#787878] hover:text-[var(--primary)] font-normal'
                }`}>
                {l}
              </Link>
            ))}
          </nav>
          <Link href={bookingLink} onClick={handleBookingClick}>
            <motion.button
              whileHover={{scale: 1.04}}
              whileTap={{scale: 0.97}}
              className="bg-[var(--primary)] text-white rounded-[16px] px-[24px] py-[12px] text-[16px] font-semibold shadow-sm hover:shadow-md transition-shadow">
              Book Now
            </motion.button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu">
          <motion.span
            animate={isMobileMenuOpen ? {rotate: 45, y: 8} : {rotate: 0, y: 0}}
            transition={{duration: 0.3}}
            className="block w-6 h-0.5 bg-[#111] rounded-full"
          />
          <motion.span
            animate={isMobileMenuOpen ? {opacity: 0} : {opacity: 1}}
            transition={{duration: 0.3}}
            className="block w-6 h-0.5 bg-[#111] rounded-full"
          />
          <motion.span
            animate={
              isMobileMenuOpen ? {rotate: -45, y: -8} : {rotate: 0, y: 0}
            }
            transition={{duration: 0.3}}
            className="block w-6 h-0.5 bg-[#111] rounded-full"
          />
        </button>
      </div>

      {/* Mobile Navigation Dropdown (Absolute Positioned for No Layout Shift) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.3, ease: 'easeInOut'}}
            // Changed to absolute to prevent pushing content down
            className="absolute top-[80px] left-0 w-full md:hidden border-b border-[#f0f0f0] bg-white shadow-xl z-40">
            <nav className="flex flex-col px-6 py-6 gap-6 font-sans">
              {links.map((l: string, i: number) => (
                <Link
                  key={l}
                  href={i === 0 ? homeLink : `${homeLink}#${l.toLowerCase()}`}
                  onClick={(e) => {
                    if (i === 0) handleHomeClick(e);
                    else setIsMobileMenuOpen(false);
                  }}
                  className={`text-[18px] transition-colors ${
                    view === 'landing' && i === 0
                      ? 'text-[var(--primary)] font-semibold'
                      : 'text-[#111] font-medium'
                  }`}>
                  {l}
                </Link>
              ))}
              <div className="pt-4 border-t border-[#f0f0f0]">
                <Link
                  href={bookingLink}
                  onClick={handleBookingClick}
                  className="block w-full">
                  <button className="w-full bg-[var(--primary)] text-white rounded-[16px] px-[24px] py-[14px] text-[16px] font-semibold active:scale-95 transition-transform">
                    Book Now
                  </button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
