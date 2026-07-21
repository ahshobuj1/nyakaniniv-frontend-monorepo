'use client';

import Link from 'next/link';

interface FooterProps {
  content?: any;
}

export default function Footer({content}: FooterProps) {
  const footerData = content?.footer || {
    logoText: 'DJ AURA',
    description:
      'Powered by UpBeat Africa - the platform where African Djs build their brand and grow their bookings.',
    instagram: '#',
    facebook: '#',
    linkedin: '#',
    quickLinks: [
      {label: 'Home', url: '#hero'},
      {label: 'About', url: '#behind-decks'},
      {label: 'Music', url: '#latest-mixes'},
      {label: 'Events', url: '#about'},
      {label: 'Gallery', url: '#live-action'},
    ],
    contactEmail: 'djaura@gmail.com',
    contactPhone: '+254 712 345678.',
    contactLocation: 'Lagos, Nigeria',
    copyright: '© 2026 Dj Aura. All rights reserved',
    poweredBy: 'UpBeat Africa',
  };

  return (
    <footer className="bg-[#151515] pt-[80px] pb-[30px] px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[60px] md:gap-[100px] mb-[60px]">
          <div className="flex flex-col gap-[20px]">
            <h2 className="text-[48px] font-bold text-[var(--primary)] uppercase tracking-tight leading-none">
              {footerData.logoText}
            </h2>
            <p className="text-[#a3a3a3] text-[15px] leading-relaxed max-w-[320px]">
              {footerData.description}
            </p>
            <div className="flex gap-[12px] mt-2">
              <Link
                href={content?.instagram || footerData.instagram || '#'}
                className="w-[40px] h-[40px] rounded-full bg-[#333333] flex items-center justify-center text-white hover:bg-[var(--primary)] transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              <Link
                href={content?.facebook || footerData.facebook || '#'}
                className="w-[40px] h-[40px] rounded-full bg-[#333333] flex items-center justify-center text-white hover:bg-[var(--primary)] transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link
                href={content?.linkedin || footerData.linkedin || '#'}
                className="w-[40px] h-[40px] rounded-full bg-[#333333] flex items-center justify-center text-white hover:bg-[var(--primary)] transition-colors duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-[24px]">
            <h3 className="text-[22px] font-bold text-white">Quick Links</h3>
            <ul className="flex flex-col gap-[16px] text-[#a3a3a3] text-[16px]">
              {footerData.quickLinks?.map((link: any, index: number) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-[24px]">
            <h3 className="text-[22px] font-bold text-white">Contact</h3>
            <ul className="flex flex-col gap-[20px] text-[#a3a3a3] text-[16px]">
              <li className="flex items-center gap-[12px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[var(--primary)]">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {content?.email || footerData.contactEmail}
              </li>
              <li className="flex items-center gap-[12px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[var(--primary)]">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {content?.phone || footerData.contactPhone}
              </li>
              <li className="flex items-center gap-[12px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[var(--primary)]">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {content?.location || footerData.contactLocation}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#333333] pt-[30px] flex flex-col md:flex-row justify-between items-center gap-[16px] text-[#a3a3a3] text-[14px]">
          <p>{footerData.copyright}</p>
          <p>
            Powerd by{' '}
            <span className="text-[var(--primary)] font-medium">
              {footerData.poweredBy}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
