'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, Home, LayoutDashboard } from 'lucide-react';
import { LandingHeader } from '@/components/LandingHeader';
import { DynamicFooter } from '@/app/(landingPage)/_components/DynamicFooter';

export default function MainPaymentCancelPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f0f0f0] text-gray-900 font-sans">
      <LandingHeader />

      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-sm p-7 sm:p-9 shadow-xs space-y-5 text-center">
          <div className="w-14 h-14 rounded-sm bg-red-50 text-[var(--primary)] border border-red-100 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Payment Cancelled
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
              Your transaction was not completed. No charges were made to your account. You can return or retry anytime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 h-10 px-5 bg-[var(--primary)] hover:opacity-90 text-white font-bold text-xs rounded-sm transition-opacity shadow-xs"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 h-10 px-5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-xs rounded-sm transition-colors shadow-2xs"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-gray-400" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </main>

      <DynamicFooter />
    </div>
  );
}
