'use client';

import React from 'react';
import {Content, Theme} from '@repo/types';
import BookingForm from '../shared/BookingForm';
import Navbar from './Navbar';

export default function KenzoBookingPage({content, theme}: {content: Content, theme: Theme}) {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <Navbar content={content} />
      
      <main className="py-24 px-6">
        <div className="max-w-[1440px] mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase">
            Reserve <span style={{ color: theme.primaryColor }}>Kenzo</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto font-medium">
            Minimalist booking for elite experiences. Secure your date now.
          </p>
        </div>

        <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl">
          <BookingForm themeColor={theme.primaryColor} />
        </div>
      </main>

      <footer className="py-16 text-center text-gray-600 text-xs tracking-widest uppercase">
        Kenzo Modern © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
