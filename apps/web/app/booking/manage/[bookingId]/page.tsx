/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {useState} from 'react';
import {useParams, useRouter, useSearchParams} from 'next/navigation';
import {useSelector} from 'react-redux';
import {
  useGetBookingPortalDetailsQuery,
  useClientCancelBookingMutation,
} from '@repo/store';
import type {RootState} from '@repo/store';
import {
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import {toast} from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner';
import {LandingHeader} from '@/components/LandingHeader';
import {DynamicFooter} from '@/app/(landingPage)/_components/DynamicFooter';
import {
  getClientBookingStatusBadge,
  normalizeBookingStatus,
  parseBookingEventDetails,
} from '@/lib/bookingStatusHelper';
import {
  formatDateInTz,
  formatTimeInTz,
  getBrowserTimezone,
} from '@/lib/timezone';

import {
  CancellationSettlement,
  EventScheduleCard,
  DjContactCard,
  CancelBookingModal,
  BookingAccessModal,
  DirectPaymentCard,
  QuoteNegotiationCard,
  BookingMessageThread,
  PostEventCard,
} from './_components';
import type {DjContactInfo, ClientContactInfo} from './_components/types';

export default function ManageBookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = params?.bookingId as string;
  const initialRef =
    searchParams.get('ref') || searchParams.get('orderReference') || '';

  // Auth inspection: Check if logged in as DJ or Admin via Redux
  const {user, token: reduxAuthToken} = useSelector(
    (state: RootState) => state.auth,
  );
  const isDjUser = user?.role === 'DJ';
  const isAdminUser = user?.role === 'ADMIN';
  const isPrivilegedUser = Boolean(reduxAuthToken && (isDjUser || isAdminUser));
  const viewerRole: 'CLIENT' | 'DJ' | 'ADMIN' = isAdminUser
    ? 'ADMIN'
    : isDjUser
      ? 'DJ'
      : 'CLIENT';

  // Read client booking access token from URL or storage
  const [clientAccessToken, setClientAccessToken] = useState<string | null>(
    () => {
      if (typeof window !== 'undefined') {
        const urlToken =
          searchParams.get('token') || searchParams.get('access_token');
        if (urlToken) {
          sessionStorage.setItem('booking_access_token', urlToken);
          localStorage.setItem('booking_access_token', urlToken);
          return urlToken;
        }
        return (
          sessionStorage.getItem('booking_access_token') ||
          localStorage.getItem('booking_access_token')
        );
      }
      return null;
    },
  );

  const [copiedRef, setCopiedRef] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // If user is DJ or Admin, they use their Redux token; otherwise use clientAccessToken
  const hasValidAuth = isPrivilegedUser || Boolean(clientAccessToken);

  const {data, isLoading, isFetching, isError, error, refetch} =
    useGetBookingPortalDetailsQuery(bookingId, {
      skip: !bookingId || !hasValidAuth,
    });

  const [cancelBooking, {isLoading: isCanceling}] =
    useClientCancelBookingMutation();

  const isAuthError =
    (error as any)?.status === 401 || (error as any)?.status === 403;

  const handleAccessSuccess = (newAccessToken?: string) => {
    const token =
      newAccessToken ||
      (typeof window !== 'undefined'
        ? sessionStorage.getItem('booking_access_token') ||
          localStorage.getItem('booking_access_token')
        : null);
    if (token) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('booking_access_token', token);
        localStorage.setItem('booking_access_token', token);
      }
      setClientAccessToken(token);
    }
  };

  const booking = data?.data;

  // Determine if client needs to authenticate with OTP (unauthenticated or invalid session)
  const isGated =
    !isPrivilegedUser && (!hasValidAuth || (isAuthError && !booking));

  // 1. Render gate modal if not authenticated as DJ/Admin and client token is missing or invalid
  if (isGated) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f0f0f0]">
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center p-4 py-16">
          <BookingAccessModal
            key={initialRef || 'modal'}
            bookingId={bookingId}
            defaultOrderReference={initialRef}
            isOpen={true}
            onSuccess={handleAccessSuccess}
          />
        </main>
        <DynamicFooter />
      </div>
    );
  }

  // 2. Loading state while query is fetching
  if (isLoading || (isFetching && !booking)) {
    return <LoadingSpinner fullScreen />;
  }

  // 3. If other non-auth error (e.g. 404), show booking not found
  if (isError && !booking) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f0f0f0]">
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center p-4 py-16">
          <div className="max-w-md w-full bg-white border border-gray-200 rounded-sm p-8 text-center space-y-4 shadow-xs">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h1 className="text-xl font-bold text-gray-900">
              Booking Not Found
            </h1>
            <p className="text-gray-500 text-xs leading-relaxed">
              We could not find the details for this booking link. It might be
              invalid, expired, or removed.
            </p>
            <div className="pt-2">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2.5 bg-primary text-white text-xs font-semibold rounded-sm hover:opacity-90 transition-opacity cursor-pointer">
                Return to Home
              </button>
            </div>
          </div>
        </main>
        <DynamicFooter />
      </div>
    );
  }

  if (!booking) {
    return <LoadingSpinner fullScreen />;
  }

  const canonicalStatus = normalizeBookingStatus(booking.status);
  const statusBadge = getClientBookingStatusBadge(
    canonicalStatus,
    booking.eventDate,
  );

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
  const djWhatsapp =
    socialLinks.whatsapp || socialLinks.phone || configObj.whatsapp;

  const cleanPhone = djPhone ? djPhone.replace(/[^\d+]/g, '') : '';
  const cleanWhatsapp = djWhatsapp
    ? djWhatsapp.replace(/[^\d+]/g, '').replace('+', '')
    : '';

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

  const formattedTime = booking.eventDate
    ? formatTimeInTz(booking.eventDate, tz)
    : '';
  const parsedDetails = parseBookingEventDetails(booking.eventDetails);
  const displayTime =
    formattedTime || parsedDetails.startTime || 'Time on Schedule';

  const referenceCode =
    booking.orderReference || `UB-${booking.id.slice(0, 8).toUpperCase()}`;

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
      const res = await cancelBooking({id: bookingId, reason}).unwrap();
      toast.success(res?.message || 'Booking cancelled successfully');
      setShowCancelModal(false);
      refetch();
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
  const isPaid = booking.directPaymentStatus === 'DJ_CONFIRMED';

  const clientContact: ClientContactInfo = {
    name: booking.client?.name || 'Client',
    email: booking.client?.email,
    phone: booking.client?.phone,
  };

  const getPortalTitle = () => {
    if (viewerRole === 'DJ') {
      return `${booking.eventType || 'Event Performance'} for ${booking.client?.name || 'Client'}`;
    }
    if (viewerRole === 'ADMIN') {
      return `${booking.eventType || 'Event Performance'} • ${djStageName} & ${booking.client?.name || 'Client'}`;
    }
    return `${booking.eventType || 'Event Performance'} with ${djStageName}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f0f0] text-gray-900 font-sans">
      <LandingHeader />

      <main className="flex-1 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Top Role Banners for Privileged Users */}
          {/* {viewerRole === 'DJ' && (
            <div className="bg-primary/10 border border-primary/20 p-3.5 sm:p-4 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-sm text-primary">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    DJ Workspace Perspective
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    You are viewing this portal from your DJ perspective. You can test interactions, revise quotes, or reply to messages.
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-sm hover:opacity-90 transition-opacity shrink-0 cursor-pointer shadow-xs">
                <span>Open in DJ Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )} */}

          {viewerRole === 'ADMIN' && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 sm:p-4 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-sm text-amber-800">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Administrative Audit & Proof Review Mode
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Full audit access enabled. You can inspect all quotation
                    proposals, price agreements, and chat logs as evidence.
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push('/admin/bookings')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-sm hover:bg-black transition-colors shrink-0 cursor-pointer shadow-xs">
                <span>Back to Admin Panel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Navigation Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {djWebsiteUrl && (
              <a
                href={djWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-primary transition-colors">
                <span>Visit {djStageName}&apos;s Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Hero Header Card */}
          <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {viewerRole === 'ADMIN'
                      ? 'Admin Inspection Portal'
                      : viewerRole === 'DJ'
                        ? 'DJ Booking Portal'
                        : 'Client Booking Portal'}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-[10px] font-medium text-gray-500 uppercase">
                    Order Ref
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  {getPortalTitle()}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={handleCopyRef}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 px-2.5 py-1 rounded-sm border border-gray-200 transition-colors cursor-pointer"
                    title="Click to copy reference">
                    <span>{referenceCode}</span>
                    {copiedRef ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </button>
                  <span className="text-xs text-gray-400">
                    Use this reference to track or verify your booking anytime.
                  </span>
                </div>
              </div>

              <div
                className={`px-3 py-1.5 rounded-sm text-xs font-bold border flex items-center gap-1.5 shrink-0 ${statusBadge.badgeClass}`}>
                <span
                  className={`w-2 h-2 rounded-full ${statusBadge.dotClass}`}
                />
                {statusBadge.label}
              </div>
            </div>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Negotiation, Payment, Messages, Settlement (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Status / Settlement Notification */}
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
                <div className="p-4 rounded-sm bg-white border border-gray-200 flex items-start gap-3.5 text-xs leading-relaxed shadow-xs">
                  <div className="p-2 bg-primary/10 rounded-sm text-primary shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {statusBadge.label}
                    </p>
                    <p className="text-gray-600 mt-0.5">
                      {statusBadge.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Quotation & Price Negotiation Card */}
              <QuoteNegotiationCard
                booking={booking}
                currencyCode={currencyCode}
                quotes={(booking as any).quotes || []}
                agreement={(booking as any).agreement}
                viewerRole={viewerRole}
                clientName={booking.client?.name || 'Client'}
                clientEmail={booking.client?.email}
                djStageName={djStageName}
                djEmail={djEmail}
                onQuoteUpdated={refetch}
              />

              {/* Direct Artist Payment Card */}
              <DirectPaymentCard
                booking={booking}
                currencyCode={currencyCode}
                totalAmount={totalAmountNumber}
                djStageName={djStageName}
                formattedDate={formattedDate}
                displayTime={displayTime}
                onPaymentReported={refetch}
              />

              {/* Asynchronous Message Thread */}
              <BookingMessageThread
                bookingId={booking.id}
                messages={(booking as any).messages || []}
                clientName={booking.client?.name || 'Client'}
                clientEmail={booking.client?.email}
                djStageName={djStageName}
                djEmail={djEmail}
                viewerRole={viewerRole}
                onMessageSent={refetch}
              />

              {/* Post-Event Actions & Reviews */}
              <PostEventCard
                booking={booking}
                review={(booking as any).review}
                onActionComplete={refetch}
              />
            </div>

            {/* Right Column: Schedule, Counterparty Contacts, Event Notes, Policies (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Event Schedule & Location */}
              <div className="bg-white border border-gray-200 rounded-sm p-5 sm:p-6 shadow-xs">
                <EventScheduleCard
                  formattedDate={formattedDate}
                  displayTime={displayTime}
                  address={booking.address}
                  eventType={booking.eventType}
                  duration={parsedDetails.duration}
                />
              </div>

              {/* Contact Card (Adapts to DJ or Client view) */}
              <div className="bg-white border border-gray-200 rounded-sm p-5 sm:p-6 shadow-xs">
                <DjContactCard
                  contact={djContact}
                  clientContact={clientContact}
                  viewerRole={viewerRole}
                />
              </div>

              {/* Event Notes / Requirements */}
              {(parsedDetails.requirements ||
                parsedDetails.otherDetails.length > 0) && (
                <div className="bg-white border border-gray-200 rounded-sm p-5 sm:p-6 shadow-xs text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-gray-800">
                    <FileText className="w-3.5 h-3.5 text-gray-500" />
                    <span>Requirements & Event Notes</span>
                  </div>
                  {parsedDetails.requirements && (
                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-sm border border-gray-100">
                      {parsedDetails.requirements}
                    </p>
                  )}
                  {parsedDetails.otherDetails.map((detail, idx) => (
                    <p
                      key={idx}
                      className="text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-sm border border-gray-100">
                      {detail}
                    </p>
                  ))}
                </div>
              )}

              {/* Cancellation & Booking Policy Card */}
              <div className="bg-white border border-gray-200 rounded-sm p-5 sm:p-6 shadow-xs text-xs space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-gray-800">
                  <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
                  <span>Booking Policy & Support</span>
                </div>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  Need to make changes or have questions about performance
                  schedules? You can message {djStageName} directly or cancel
                  your booking request below.
                </p>

                {canCancel && (
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(true)}
                      className="w-full py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-sm text-xs font-semibold transition-colors cursor-pointer text-center">
                      Cancel Booking
                    </button>
                  </div>
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
        djStageName={djStageName}
        isConfirmedBooking={canonicalStatus === 'CONFIRMED'}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
