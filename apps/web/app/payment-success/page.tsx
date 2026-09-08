'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  Home, 
  Calendar, 
  MapPin, 
  Copy, 
  Check, 
  Music, 
  Loader2 
} from 'lucide-react';
import { useGetBookingByIdQuery } from '@repo/store';
import { parseBookingEventDetails } from '@/lib/bookingStatusHelper';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [copiedRef, setCopiedRef] = useState(false);

  const bookingId = searchParams.get('bookingId') || searchParams.get('id') || undefined;
  const reference = searchParams.get('reference') || searchParams.get('trxref') || searchParams.get('OrderTrackingId') || '';

  const { data: bookingResponse, isLoading } = useGetBookingByIdQuery(bookingId as string, {
    skip: !bookingId,
  });
  const booking = bookingResponse?.data;

  const parsedDetails = parseBookingEventDetails(booking?.eventDetails);
  const timeDisplay = parsedDetails.startTime || '';
  const stageName = booking?.tenant?.stageName || booking?.tenant?.user?.firstName || 'Your DJ';
  const subdomain = booking?.tenant?.subdomain;

  const referenceCode = reference || (bookingId ? `UB-${bookingId.slice(0, 8).toUpperCase()}` : 'UB-CONFIRMED');

  const handleCopy = () => {
    if (!referenceCode) return;
    navigator.clipboard.writeText(referenceCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const getDjWebsiteUrl = () => {
    if (!subdomain) return '/';
    // If on localhost development
    if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
      return `http://${subdomain}.localhost:3000`;
    }
    // In production or relative fallback
    return `/site/${subdomain}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDFD] via-[#F8FAFC] to-[#F1F5F9] text-[#111620] py-12 px-4 sm:px-6 relative overflow-hidden font-sans flex flex-col items-center justify-center">
      {/* Dynamic ambient background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/[0.07] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/[0.06] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl w-full mx-auto space-y-6 relative z-10">
        {/* Navigation Bar */}
        <header className="bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-2xl px-5 py-3 shadow-xs flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/auth.logo.png"
              alt="UpBeat Entertainment Africa"
              width={120}
              height={32}
              className="h-6 w-auto object-contain"
            />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors px-2 py-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>UpBeat Home</span>
          </Link>
        </header>

        {/* Success Card */}
        <div className="rounded-3xl bg-white border border-emerald-200/90 p-8 sm:p-10 shadow-xl relative overflow-hidden text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Escrow Protected • Booking Secured
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111620]">
              Payment Successful!
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Your payment has been received and safely locked in Escrow. {stageName ? `${stageName} has been notified and your date is confirmed.` : 'Your date is officially reserved.'}
            </p>
          </div>

          {/* Reference Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-700">
            <span className="text-gray-400 select-none">Ref:</span>
            <span className="font-bold text-gray-900">{referenceCode}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-gray-400 hover:text-gray-700 transition-colors ml-1 cursor-pointer"
              title="Copy reference code"
            >
              {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Booking Summary Card */}
          {isLoading ? (
            <div className="py-6 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Loading booking details...</span>
            </div>
          ) : booking ? (
            <div className="rounded-2xl bg-gray-50/90 border border-gray-200/80 p-5 text-left text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200/70 pb-2.5">
                <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-primary" />
                  {stageName}
                </span>
                <span className="font-semibold text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {booking.eventType || 'Event Performance'}
                </span>
              </div>

              <div className="space-y-2 text-gray-600">
                {booking.eventDate && (
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900">
                        {new Date(booking.eventDate).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      {timeDisplay && <span className="text-gray-500 ml-1.5">({timeDisplay})</span>}
                    </div>
                  </div>
                )}

                {booking.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <span>{booking.address}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-gray-200/70 flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Amount Paid</span>
                <span className="font-bold text-sm text-primary font-mono">
                  {booking.currencyCode || 'KES'} {Number(booking.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50/80 border border-gray-200/80 p-4 text-left text-xs space-y-2">
              <div className="flex justify-between items-center text-gray-600">
                <span className="font-semibold text-[11px] uppercase tracking-wider">Escrow Guarantee</span>
                <span className="font-bold text-emerald-700">100% Protected until gig ends</span>
              </div>
              <p className="text-gray-500 text-[11px]">
                Your funds remain safely in Escrow and are only transferred to the artist after the event concludes successfully.
              </p>
            </div>
          )}

          {/* User Options: 2 Clear Navigation Paths */}
          <div className="space-y-3 pt-2">
            <p className="text-xs text-gray-500 font-medium">
              Where would you like to go next?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {subdomain ? (
                <a
                  href={getDjWebsiteUrl()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-primary hover:bg-[#d62828] text-white font-bold text-sm shadow-lg shadow-primary/25 transition-all cursor-pointer"
                >
                  <span>Visit {stageName}&apos;s Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-primary hover:bg-[#d62828] text-white font-bold text-sm shadow-lg shadow-primary/25 transition-all cursor-pointer"
                >
                  <span>Explore UpBeat Africa</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}

              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-[#111620] font-bold text-sm shadow-2xs transition-colors"
              >
                <Home className="w-4 h-4 text-gray-500" />
                <span>UpBeat Africa Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
