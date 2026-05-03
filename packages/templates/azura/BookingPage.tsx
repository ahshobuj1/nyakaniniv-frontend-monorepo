'use client';

import React from 'react';
import {Content, Theme} from '@repo/types';
import BookingForm from '../shared/BookingForm';
import Navbar from './Navbar';

export default function AzuraBookingPage({
  content,
  theme,
  onViewChange,
}: {
  content: Content;
  theme: Theme;
  onViewChange?: (view: 'landing' | 'booking') => void;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <Navbar content={content} onViewChange={onViewChange} />
      
      <main className="py-20 px-6">
        <div className="max-w-[1440px] mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Book <span style={{ color: theme.primaryColor }}>Your Event</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Take the first step towards an incredible event. Fill out the form below to book your session with DJ AURA.
          </p>
        </div>

        <BookingForm themeColor={theme.primaryColor} />
      </main>

      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} DJ AURA. All rights reserved.
      </footer>
    </div>
  );
}
