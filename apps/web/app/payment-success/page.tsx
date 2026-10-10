'use client';

import React, {Suspense, useState} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
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
} from 'lucide-react';
import {useGetBookingByIdQuery} from '@repo/store';
import {LandingHeader} from '@/components/LandingHeader';
import {DynamicFooter} from '@/app/(landingPage)/_components/DynamicFooter';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  formatDateInTz,
  formatTimeInTz,
  getBrowserTimezone,
} from '@/lib/timezone';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [copiedRef, setCopiedRef] = useState(false);

  const bookingId =
    searchParams.get('bookingId') || searchParams.get('id') || undefined;
  const reference =
    searchParams.get('reference') ||
    searchParams.get('trxref') ||
    searchParams.get('OrderTrackingId') ||
    '';

  const {data: bookingResponse, isLoading} = useGetBookingByIdQuery(
    bookingId as string,
    {
      skip: !bookingId,
    },
  );
  const booking = bookingResponse?.data;

  const stageName =
    booking?.tenant?.stageName || booking?.tenant?.user?.firstName || 'DJ';
  const subdomain = booking?.tenant?.subdomain;

  const referenceCode =
    reference ||
    (bookingId ? `UB-${bookingId.slice(0, 8).toUpperCase()}` : 'UB-CONFIRMED');

  const handleCopy = () => {
    if (!referenceCode) return;
    navigator.clipboard.writeText(referenceCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const getDjWebsiteUrl = () => {
    if (!subdomain) return '/';
    if (
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1')
    ) {
      const port = window.location.port ? `:${window.location.port}` : '';
      return `http://${subdomain}.localhost${port}`;
    }
    return `https://${subdomain}.deejay.africa`;
  };

  const tz = booking?.eventTimezone || getBrowserTimezone();
  const formattedDate = booking?.eventDate
    ? formatDateInTz(booking.eventDate, tz, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
  const formattedTime = booking?.eventDate
    ? formatTimeInTz(booking.eventDate, tz)
    : '';

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f0f0] text-gray-900 font-sans">
      <LandingHeader />

      <main className="flex-1 py-10 sm:py-14 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white border border-gray-200 rounded-sm p-7 sm:p-9 shadow-xs space-y-6 text-center">
          {/* Success Icon */}
          <div className="w-14 h-14 rounded-sm bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Escrow
              Protected • Booking Secured
            </span>
            <h1 className="text-2xl font-bold text-gray-900 pt-1">
              Payment Successful!
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
              Your payment has been received and safely locked in UpBeat Escrow.{' '}
              {stageName
                ? `${stageName} has been notified and your date is confirmed.`
                : 'Your date is officially reserved.'}
            </p>
          </div>

          {/* Reference Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-gray-50 border border-gray-200 text-xs font-mono text-gray-700">
            <span className="text-gray-400 select-none">Ref:</span>
            <span className="font-bold text-gray-900">{referenceCode}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-gray-400 hover:text-gray-700 transition-colors ml-1 cursor-pointer"
              title="Copy reference code">
              {copiedRef ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Booking Summary Card */}
          {isLoading ? (
            <LoadingSpinner smallHeight />
          ) : booking ? (
            <div className="rounded-sm bg-gray-50/80 border border-gray-200 p-4 text-left text-xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-gray-200/80 pb-2">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-[var(--primary)]" />
                  {stageName}
                </span>
                <span className="font-semibold text-[11px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-sm">
                  {booking.eventType || 'Event Performance'}
                </span>
              </div>

              <div className="space-y-1.5 text-gray-600">
                {formattedDate && (
                  <div className="flex items-start gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-900">
                        {formattedDate}
                      </span>
                      {formattedTime && (
                        <span className="text-gray-500 ml-1.5 font-medium">
                          ({formattedTime})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {booking.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span className="truncate">{booking.address}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Amount Paid</span>
                <span className="font-bold text-sm text-[var(--primary)] font-mono">
                  {booking.currencyCode || 'KES'}{' '}
                  {Number(booking.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          ) : null}

          {/* Navigation Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            {bookingId && (
              <Link
                href={`/booking/manage/${bookingId}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:opacity-90 text-white font-bold text-xs rounded-sm transition-opacity shadow-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>View / Manage Booking</span>
              </Link>
            )}

            {subdomain ? (
              <a
                href={getDjWebsiteUrl()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-xs rounded-sm transition-colors">
                <span>Visit {stageName}&apos;s Profile</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>
            ) : (
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold text-xs rounded-sm transition-colors">
                <Home className="w-3.5 h-3.5 text-gray-400" />
                <span>UpBeat Home</span>
              </Link>
            )}
          </div>
        </div>
      </main>

      <DynamicFooter />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
