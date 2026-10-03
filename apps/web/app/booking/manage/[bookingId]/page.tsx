'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetClientBookingQuery, useClientCancelBookingMutation } from '@repo/store';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Banknote,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { LandingHeader } from '@/components/LandingHeader';
import { DynamicFooter } from '@/app/(landingPage)/_components/DynamicFooter';
import {
  getClientBookingStatusBadge,
  normalizeBookingStatus,
  parseBookingEventDetails,
  calculateCancellationPreview,
} from '@/lib/bookingStatusHelper';
import { formatDateInTz, formatTimeInTz, getBrowserTimezone } from '@/lib/timezone';

import {
  CancellationSettlement,
  EventScheduleCard,
  DjContactCard,
  CancelBookingModal,
} from './_components';
import type { DjContactInfo } from './_components';

export default function ManageBookingPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.bookingId as string;

  const { data, isLoading, isError } = useGetClientBookingQuery(bookingId, {
    skip: !bookingId,
  });

  const [cancelBooking, { isLoading: isCanceling }] = useClientCancelBookingMutation();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f0f0f0]">
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
            <p className="text-xs text-gray-500 font-medium">Loading booking details...</p>
          </div>
        </main>
        <DynamicFooter />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f0f0f0]">
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center p-4 py-16">
          <div className="max-w-md w-full bg-white border border-gray-200 rounded-sm p-8 text-center space-y-4 shadow-xs">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h1 className="text-xl font-bold text-gray-900">Booking Not Found</h1>
            <p className="text-gray-500 text-xs leading-relaxed">
              We could not find the details for this booking link. It might be invalid, expired, or removed.
            </p>
            <div className="pt-2">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2.5 bg-[var(--primary)] text-white text-xs font-semibold rounded-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        </main>
        <DynamicFooter />
      </div>
    );
  }

  const booking = data.data;
  const canonicalStatus = normalizeBookingStatus(booking.status);
  const statusBadge = getClientBookingStatusBadge(canonicalStatus, booking.eventDate);

  const tenant = booking.tenant;
  const djStageName = tenant?.stageName || tenant?.user?.firstName || 'DJ';
  const djEmail = tenant?.user?.email || (tenant?.config as any)?.contactEmail;
  const subdomain = tenant?.subdomain;

  // Contact info extraction
  const socialLinks = (tenant?.socialLinks as Record<string, any>) || {};
  const configObj = (tenant?.config as Record<string, any>) || {};
  const djPhone =
    socialLinks.phone ||
    socialLinks.whatsapp ||
    configObj.phone ||
    configObj.contactPhone ||
    (tenant?.user as any)?.phone;
  const djWhatsapp = socialLinks.whatsapp || socialLinks.phone || configObj.whatsapp;

  const cleanPhone = djPhone ? djPhone.replace(/[^\d+]/g, '') : '';
  const cleanWhatsapp = djWhatsapp ? djWhatsapp.replace(/[^\d+]/g, '').replace('+', '') : '';

  const getDjWebsiteUrl = () => {
    if (!subdomain) return undefined;
    if (typeof window === 'undefined') return `/site/${subdomain}`;
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${subdomain}.localhost${port}`;
    }
    return `https://${subdomain}.deejay.africa`;
  };

  const djWebsiteUrl = getDjWebsiteUrl();

  const djContact: DjContactInfo = {
    stageName: djStageName,
    email: djEmail,
    phone: djPhone,
    cleanPhone,
    whatsapp: djWhatsapp,
    cleanWhatsapp,
    websiteUrl: djWebsiteUrl,
  };

  // Date and Time
  const tz = booking.eventTimezone || getBrowserTimezone();
  const formattedDate = booking.eventDate
    ? formatDateInTz(booking.eventDate, tz, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date to be confirmed';

  const formattedTime = booking.eventDate ? formatTimeInTz(booking.eventDate, tz) : '';
  const parsedDetails = parseBookingEventDetails(booking.eventDetails);
  const displayTime = formattedTime || parsedDetails.startTime || 'Time on Schedule';

  const referenceCode = `UB-${booking.id.slice(0, 8).toUpperCase()}`;

  const handleCopyRef = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(referenceCode);
      setCopiedRef(true);
      toast.success('Reference code copied to clipboard');
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleConfirmCancel = async (reason: string) => {
    try {
      const res = await cancelBooking({ id: bookingId, reason }).unwrap();
      toast.success(res?.message || 'Booking cancelled successfully');
      setShowCancelModal(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to cancel booking');
    }
  };

  const canCancel =
    canonicalStatus !== 'COMPLETED' &&
    canonicalStatus !== 'CANCELLED' &&
    canonicalStatus !== 'REJECTED' &&
    canonicalStatus !== 'EXPIRED';

  const totalAmountNumber = Number(booking.totalAmount || 0);
  const currencyCode = booking.currencyCode || 'KES';
  const isAwaitingPayment = canonicalStatus === 'AWAITING_PAYMENT';
  const isPaid =
    booking.paymentStatus === 'PAID' ||
    booking.paymentStatus === 'REFUND_PENDING' ||
    booking.paymentStatus === 'PARTIALLY_REFUNDED' ||
    booking.invoice?.status === 'PAID';

  const cancellationPreview = calculateCancellationPreview(
    booking.eventDate,
    totalAmountNumber,
    isPaid
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f0f0] text-gray-900 font-sans">
      <LandingHeader />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Back Navigation & Breadcrumb */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {djWebsiteUrl && (
              <a
                href={djWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-primary transition-colors"
              >
                <span>Visit {djStageName}&apos;s Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Main Booking Card */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden">
            {/* Header */}
            <div className="p-6 sm:p-7 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-1">
                  Client Booking Portal
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  {booking.eventType || 'Event Performance'} with {djStageName}
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-gray-400">Reference:</span>
                  <button
                    onClick={handleCopyRef}
                    className="inline-flex items-center gap-1 font-mono text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 px-2 py-0.5 rounded-sm border border-gray-200 transition-colors cursor-pointer"
                    title="Click to copy reference"
                  >
                    <span>{referenceCode}</span>
                    {copiedRef ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div className={`px-3 py-1.5 rounded-sm text-xs font-bold border flex items-center gap-1.5 shrink-0 ${statusBadge.badgeClass}`}>
                <span className={`w-2 h-2 rounded-full ${statusBadge.dotClass}`} />
                {statusBadge.label}
              </div>
            </div>

            <div className="p-6 sm:p-7 space-y-6">
              {/* Cancellation & Refund Settlement Card if Cancelled */}
              {canonicalStatus === 'CANCELLED' ? (
                <CancellationSettlement
                  booking={booking}
                  parsedDetails={parsedDetails}
                  currencyCode={currencyCode}
                  totalAmount={totalAmountNumber}
                  isPaid={isPaid}
                  djStageName={djStageName}
                />
              ) : (
                /* Friendly Status Box */
                <div className="p-4 rounded-sm bg-gray-50 border border-gray-200/80 flex items-start gap-3 text-xs leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-900">{statusBadge.label}</p>
                    <p className="text-gray-600 mt-0.5">{statusBadge.description}</p>
                  </div>
                </div>
              )}

              {/* Quotation Prompt if Awaiting Payment */}
              {isAwaitingPayment && (
                <div className="p-4 rounded-sm bg-orange-50/80 border border-orange-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 block">
                      Quotation Ready
                    </span>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                      Total Due: <span className="text-[var(--primary)] font-mono">{currencyCode} {totalAmountNumber.toLocaleString()}</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Pay online to lock in your date with 100% Escrow Protection.
                    </p>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Link
                      href={`/checkout/${booking.id}`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[var(--primary)] hover:opacity-90 text-white text-xs font-bold rounded-sm shadow-xs transition-opacity"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Proceed to Payment</span>
                    </Link>

                    <Link
                      href={`/checkout/${booking.id}?requestCash=true`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-sm transition-colors"
                    >
                      <Banknote className="w-3.5 h-3.5 text-gray-500" />
                      <span>Cash</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Grid: Event Schedule & DJ Contacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EventScheduleCard
                  formattedDate={formattedDate}
                  displayTime={displayTime}
                  address={booking.address}
                  eventType={booking.eventType}
                  duration={parsedDetails.duration}
                />

                <DjContactCard contact={djContact} />
              </div>

              {/* Event Notes / Requirements */}
              {(parsedDetails.requirements || parsedDetails.otherDetails.length > 0) && (
                <div className="p-4 bg-gray-50/70 rounded-sm border border-gray-200/80 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-gray-700">
                    <FileText className="w-3.5 h-3.5 text-gray-500" />
                    <span>Requirements & Event Notes</span>
                  </div>
                  {parsedDetails.requirements && (
                    <p className="text-gray-600 leading-relaxed">{parsedDetails.requirements}</p>
                  )}
                  {parsedDetails.otherDetails.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 leading-relaxed">
                      {detail}
                    </p>
                  ))}
                </div>
              )}

              {/* Quotation & Pricing Summary if amount set */}
              {totalAmountNumber > 0 && (
                <div className="p-4 bg-gray-50/70 rounded-sm border border-gray-200/80 text-xs space-y-2">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Performance Fee</span>
                    <span className="font-semibold font-mono text-gray-900">
                      {currencyCode} {totalAmountNumber.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      UpBeat Escrow Protection
                    </span>
                    <span className="font-semibold text-emerald-700">Included</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-[var(--primary)] font-mono">
                      {currencyCode} {totalAmountNumber.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Cancellation Policy Banner */}
              <div className="p-4 bg-amber-50/80 rounded-sm border border-amber-200/70 text-xs text-amber-950 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-700" /> UpBeat Escrow Cancellation Policy
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-amber-900/90 text-[11px] leading-relaxed">
                  <li><strong>72+ hours before event:</strong> 100% full refund to original payment method.</li>
                  <li><strong>24–72 hours before event:</strong> 50% partial refund (50% compensates artist for reserved schedule).</li>
                  <li><strong>Less than 24 hours:</strong> Non-refundable due to reserved date commitment.</li>
                </ul>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-100">
                {canCancel && (
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-sm text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Request Cancellation
                  </button>
                )}

                {isAwaitingPayment && (
                  <Link
                    href={`/checkout/${booking.id}`}
                    className="px-5 py-2.5 bg-[var(--primary)] hover:opacity-90 text-white rounded-sm text-xs font-bold transition-opacity flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Proceed to Payment</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <DynamicFooter />

      {/* Cancellation Modal */}
      <CancelBookingModal
        isOpen={showCancelModal}
        isCanceling={isCanceling}
        currencyCode={currencyCode}
        totalAmount={totalAmountNumber}
        formattedDate={formattedDate}
        displayTime={displayTime}
        cancellationPreview={cancellationPreview}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
