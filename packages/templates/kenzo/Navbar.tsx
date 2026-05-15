'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import {usePathname, useSearchParams} from 'next/navigation';
import {motion, AnimatePresence} from 'framer-motion';

export default function Navbar({content, view, onViewChange}: any) {
  const [isOpen, setIsOpen] = useState(false);
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

  const navLinks = [
    {
      name: 'Home',
      href: homeLink,
      onClick: handleHomeClick,
      active: view !== 'booking',
    },
    {name: 'About', href: '#', active: false},
    {name: 'Music', href: '#', active: false},
    {name: 'Events', href: '#', active: false},
    {name: 'Gallery', href: '#', active: false},
  ];
  return (
    <nav className="absolute top-0 left-0 w-full z-50 py-6 px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link
            href={homeLink}
            onClick={handleHomeClick}
            className="text-3xl md:text-4xl font-black tracking-wider uppercase text-[var(--primary)]">
            {content?.djName || 'KENZO'}
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={link.onClick}
              className={`text-[15px] transition-colors ${
                link.active
                  ? 'text-[var(--primary)] border border-[var(--primary)] px-6 py-2 rounded-full'
                  : 'text-gray-300 hover:text-white'
              }`}>
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:block">
          <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
            <Link
              href={bookingLink}
              onClick={handleBookingClick}
              className="bg-[var(--primary)] text-white px-8 py-3 rounded-[12px] font-semibold text-[15px] transition-colors inline-block">
              Book Now
            </Link>
          </motion.div>
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white p-2 focus:outline-none">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-md border-b border-white/10 lg:hidden">
            <div className="flex flex-col items-center py-8 gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    if (link.onClick) link.onClick(e);
                    setIsOpen(false);
                  }}
                  className={`text-[16px] ${
                    link.active
                      ? 'text-[var(--primary)]'
                      : 'text-gray-300 hover:text-white'
                  }`}>
                  {link.name}
                </Link>
              ))}

              <motion.div
                whileTap={{scale: 0.95}}
                className="w-[80%] max-w-[250px] mt-4">
                <Link
                  href={bookingLink}
                  onClick={(e) => {
                    handleBookingClick(e);
                    setIsOpen(false);
                  }}
                  className="bg-[var(--primary)] text-white px-8 py-3 rounded-[12px] font-semibold text-[16px] flex justify-center w-full">
                  Book Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
