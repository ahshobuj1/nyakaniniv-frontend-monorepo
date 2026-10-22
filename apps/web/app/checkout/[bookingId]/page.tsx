'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { LandingHeader } from '@/components/LandingHeader';
import { DynamicFooter } from '@/app/(landingPage)/_components/DynamicFooter';

export default function BookingCheckoutRedirect() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.bookingId as string;

  useEffect(() => {
    if (bookingId) {
      // Automatically redirect to the new booking portal
      const timer = setTimeout(() => {
        router.replace(`/booking/manage/${bookingId}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [bookingId, router]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f0f0]">
      <LandingHeader />
      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-sm p-8 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            Direct Booking Portal
          </h1>
          <p className="text-gray-600 text-xs leading-relaxed">
            Booking payments on UpBeat Africa are settled directly between clients and artists. Redirecting you to your secure booking portal...
          </p>
          <div className="pt-2">
            <Link
              href={`/booking/manage/${bookingId}`}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-primary text-white text-xs font-semibold rounded-sm hover:opacity-90 transition-opacity">
              <span>Go to Booking Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <DynamicFooter />
    </div>
  );
}
