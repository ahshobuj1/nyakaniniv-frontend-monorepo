/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  useGetBookingByIdQuery,
  useRequestCashPaymentMutation,
  useLazyGetBookingPaymentLinkQuery,
} from '@repo/store';
import {
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  Smartphone,
  Globe2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Banknote,
  Sparkles,
  Lock,
  Home,
  ExternalLink,
  ArrowLeft,
  Music,
  Disc3,
  Copy,
  Check,
  Zap,
  Shield,
  BadgeCheck,
  Radio,
} from 'lucide-react';
import { Button } from '@repo/ui';
import LoadingSpinner from '@/components/LoadingSpinner';
import { normalizeBookingStatus, parseBookingEventDetails } from '@/lib/bookingStatusHelper';
import { toast } from 'sonner';
import {
  PaystackBrandLogo,
  PesapalBrandLogo,
  FlutterwaveBrandLogo,
  PaymentMethodBadge,
} from '@/components/payment/PaymentMethodLogos';
import { CheckoutGatewayChoice, PaymentGatewayId } from '@/types/payment.types';

const GATEWAY_CHOICES: CheckoutGatewayChoice[] = [
  {
    id: 'PAYSTACK',
    name: 'Paystack Checkout',
    badge: 'Cards & Bank Transfer',
    tagline: 'Instant 1-Click Payment',
    paymentMethods: ['Visa', 'Mastercard', 'Bank Transfer', 'Apple Pay', 'Verve'],
    description: 'Direct cards, EFT, and bank debit across Nigeria, Kenya, Ghana, South Africa & International.',
    supportedCurrencies: 'NGN, KES, GHS, ZAR, USD',
  },
  {
    id: 'PESAPAL',
    name: 'Pesapal Gateway',
    badge: 'Mobile Money & Cards',
    tagline: 'Fast East African Rails',
    paymentMethods: ['M-Pesa', 'Airtel Money', 'Tigo Pesa', 'Visa', 'Mastercard'],
    description: 'Instant mobile wallet checkout across Kenya, Tanzania, Uganda, and Rwanda.',
    supportedCurrencies: 'KES, TZS, UGX, RWF, USD',
  },
  {
    id: 'FLUTTERWAVE',
    name: 'Flutterwave',
    badge: 'Pan-African & Global',
    tagline: '15+ African Currencies',
    paymentMethods: ['Visa', 'Mastercard', 'Mobile Money', 'Bank Wire'],
    description: 'Universal checkout supporting credit cards, mobile wallets, and international bank transfers.',
    supportedCurrencies: 'All African Currencies + USD/EUR',
  },
];

function CheckoutContent() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.bookingId as string;

  const { data: bookingResponse, isLoading, error } = useGetBookingByIdQuery(bookingId, {
    skip: !bookingId,
  });

  const [getPaymentLink, { isLoading: isGeneratingLink }] = useLazyGetBookingPaymentLinkQuery();
  const [requestCash, { isLoading: isRequestingCash }] = useRequestCashPaymentMutation();

  const [selectedGateway, setSelectedGateway] = useState<'PAYSTACK' | 'PESAPAL' | 'FLUTTERWAVE'>('PAYSTACK');
  const [cashModalOpen, setCashModalOpen] = useState(false);
  const [cashRequestedSuccess, setCashRequestedSuccess] = useState(false);
  const [copiedReference, setCopiedReference] = useState(false);
  const [overrideOnlinePayment, setOverrideOnlinePayment] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('requestCash') === 'true') {
      setCashModalOpen(true);
    }
  }, [searchParams]);

  const booking = bookingResponse?.data;
  const status = normalizeBookingStatus(booking?.status);

  // Cash transaction & status checks
  const transactions = (booking as any)?.invoice?.transactions || [];
  const cashTx = transactions.find((tx: any) => tx.gateway === 'CASH');
  const isCashApproved = Boolean(cashTx?.metadata?.cashApproved) || (status === 'CONFIRMED' && (booking as any)?.paymentMethod === 'CASH');
  const isCashDeclined = cashTx?.status === 'FAILED';
  const isCashPending = (cashTx?.status === 'PENDING' && !isCashApproved) || cashRequestedSuccess;

  // Inactive / Declined status check
  const isDeclinedOrInactive = status === 'REJECTED' || status === 'CANCELLED' || status === 'EXPIRED';
  const declineReason = (booking?.eventDetails as any)?.declineReason || null;

  // If already paid via gateway or completed
  const isAlreadyPaid = (booking?.paymentStatus === 'PAID' || status === 'COMPLETED' || (status === 'CONFIRMED' && !isCashApproved)) && !isCashPending;

  const subdomain = booking?.tenant?.subdomain;
  const getDjWebsiteUrl = () => {
    if (!subdomain) return '/';
    if (typeof window === 'undefined') return `/site/${subdomain}`;
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${subdomain}.localhost${port}`;
    }
    
    return `https://${subdomain}.deejay.africa`;
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(code);
      setCopiedReference(true);
      toast.success('Reference code copied to clipboard!');
      setTimeout(() => setCopiedReference(false), 2000);
    }
  };

  const handleOnlinePayment = async () => {
    if (!bookingId) return;
    try {
      const res = await getPaymentLink({
        id: bookingId,
        gateway: selectedGateway.toLowerCase(),
      }).unwrap();

      const checkoutUrl = res?.data?.checkoutUrl;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error('Could not generate checkout link. Please try again.');
      }
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to initialize payment session.');
    }
  };

  const handleRequestCash = async () => {
    if (!bookingId) return;
    try {
      await requestCash(bookingId).unwrap();
      setCashRequestedSuccess(true);
      setCashModalOpen(false);
      toast.success('Cash payment requested. The DJ has been notified.');
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to request cash payment.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 text-[#111620] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Disc3 className="w-8 h-8 text-primary absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="text-sm font-semibold text-gray-600 animate-pulse">
          Loading secure checkout experience...
        </p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 text-[#111620]">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-white border border-gray-200 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#111620]">Booking Not Found</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            We could not find the booking details for reference #{bookingId?.slice(0, 8)}. Please verify your link or get in touch with your DJ.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-primary hover:bg-[#d62828] text-white text-xs font-bold shadow-lg shadow-primary/25 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Back to UpBeat Africa</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const parsedDetails = parseBookingEventDetails(booking.eventDetails);
  const timeDisplay = parsedDetails.startTime || 'Standard Set';
  const durationDisplay = parsedDetails.duration;
  const stageName = booking.tenant?.stageName || booking.tenant?.subdomain || 'UpBeat DJ';
  const referenceCode = `UB-${booking.id?.slice(0, 8)?.toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Simple Professional Header */}
        <header className="bg-white border border-gray-200 rounded-xl px-5 py-3.5 shadow-2xs flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/auth.logo.png"
              alt="UpBeat Africa"
              width={220}
              height={136}
              className="h-16 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-3">
            {subdomain && (
              <a
                href={getDjWebsiteUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-primary transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200"
                title={`Visit ${stageName}'s website`}
              >
                <span>{stageName}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>
            )}

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors px-2 py-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
        </header>

        {/* STATE 0: Booking Declined / Inactive */}
        {isDeclinedOrInactive && (
          <div className="max-w-md mx-auto bg-white border border-rose-200 rounded-2xl p-8 sm:p-10 shadow-xs text-center space-y-6 my-8">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                Booking {status === 'REJECTED' ? 'Declined' : status === 'CANCELLED' ? 'Cancelled' : 'Expired'}
              </span>
              <h1 className="text-2xl font-bold text-gray-900">
                Payment Link Inactive
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                This booking request has been {status === 'REJECTED' ? 'declined by the DJ' : status.toLowerCase()}. This checkout link is no longer valid and payments cannot be processed.
              </p>
              {declineReason && (
                <div className="p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl text-xs text-rose-800 text-left mt-3">
                  <span className="font-bold block mb-1">Reason from DJ:</span>
                  <span>{declineReason}</span>
                </div>
              )}
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={getDjWebsiteUrl()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary hover:bg-[#d62828] text-white font-medium text-sm transition-colors cursor-pointer shadow-xs"
              >
                <span>Visit DJ Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors shadow-xs"
              >
                <Home className="w-4 h-4 text-gray-500" />
                <span>UpBeat Africa Home</span>
              </Link>
            </div>
          </div>
        )}

        {/* STATE 1: Cash Payment APPROVED by DJ */}
        {isCashApproved && !isDeclinedOrInactive && (
          <div className="max-w-md mx-auto bg-white border border-emerald-200 rounded-2xl p-8 sm:p-10 shadow-xs text-center space-y-6 my-8">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" /> Cash on Arrival Approved
              </span>
              <h1 className="text-2xl font-bold text-gray-900">
                Cash Payment Approved!
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Great news! <strong className="text-gray-900">{stageName}</strong> has approved your cash payment request. Your booking is officially confirmed! Please coordinate directly with the DJ and prepare exact cash on event day.
              </p>
            </div>

            {/* Booking Summary Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center text-gray-600">
                <span className="font-medium text-gray-500">Booking Reference</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(referenceCode)}
                  className="inline-flex items-center gap-1.5 font-mono font-bold text-gray-900 hover:text-primary transition-colors bg-white px-2 py-0.5 rounded border border-gray-200 cursor-pointer"
                  title="Click to copy"
                >
                  <span>{referenceCode}</span>
                  {copiedReference ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                </button>
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <span className="font-medium text-gray-500">DJ / Artist</span>
                <span className="font-semibold text-gray-900">{stageName}</span>
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <span className="font-medium text-gray-500">Event Date</span>
                <span className="font-semibold text-gray-900">
                  {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'TBD'}
                </span>
              </div>

              <div className="flex justify-between items-center text-gray-900 pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-700">Total Cash to Pay on Site</span>
                <span className="font-bold text-base text-emerald-700 font-mono">
                  {booking.currencyCode || 'KES'} {Number(booking.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={getDjWebsiteUrl()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary hover:bg-[#d62828] text-white font-medium text-sm transition-colors cursor-pointer shadow-xs"
              >
                <span>Visit DJ Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors shadow-xs"
              >
                <Home className="w-4 h-4 text-gray-500" />
                <span>UpBeat Africa Home</span>
              </Link>
            </div>
          </div>
        )}

        {/* STATE 2: Cash Payment REQUESTED (Pending Approval) */}
        {!isDeclinedOrInactive && !isCashApproved && isCashPending && !overrideOnlinePayment && (
          <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-xs text-center space-y-6 my-8">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
              <Banknote className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">
                <Clock className="w-3.5 h-3.5 text-amber-700" /> Pending DJ Review
              </span>
              <h1 className="text-2xl font-bold text-gray-900">
                Cash Payment Requested
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                The DJ has received your cash payment request. Once approved by the DJ, your date will be reserved and you will receive an email confirmation. Please coordinate directly with the DJ and prepare exact cash on event day.
              </p>
            </div>

            {/* Booking Summary Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center text-gray-600">
                <span className="font-medium text-gray-500">Booking Reference</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(referenceCode)}
                  className="inline-flex items-center gap-1.5 font-mono font-bold text-gray-900 hover:text-primary transition-colors bg-white px-2 py-0.5 rounded border border-gray-200 cursor-pointer"
                  title="Click to copy"
                >
                  <span>{referenceCode}</span>
                  {copiedReference ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                </button>
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <span className="font-medium text-gray-500">DJ / Artist</span>
                <span className="font-semibold text-gray-900">{stageName}</span>
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <span className="font-medium text-gray-500">Event Date</span>
                <span className="font-semibold text-gray-900">
                  {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'TBD'}
                </span>
              </div>

              <div className="flex justify-between items-center text-gray-900 pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-700">Total Cash Due on Arrival</span>
                <span className="font-bold text-base text-primary font-mono">
                  {booking.currencyCode || 'KES'} {Number(booking.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Navigation & Alternative Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={getDjWebsiteUrl()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary hover:bg-[#d62828] text-white font-medium text-sm transition-colors cursor-pointer shadow-xs"
                >
                  <span>Visit DJ Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors shadow-xs"
                >
                  <Home className="w-4 h-4 text-gray-500" />
                  <span>UpBeat Africa Home</span>
                </Link>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setOverrideOnlinePayment(true)}
                  className="text-xs text-gray-500 hover:text-primary transition-colors cursor-pointer underline py-1"
                >
                  Want instant confirmation? Pay online via Escrow instead
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATE 3: Already Paid via Gateway (Simple & Professional) */}
        {!isDeclinedOrInactive && isAlreadyPaid && !isCashApproved && (
          <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-xs text-center space-y-6 my-8">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Booking Confirmed!
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Payment has been successfully secured in UpBeat Escrow. <strong className="text-gray-900">{stageName}</strong> has reserved your event date.
              </p>
            </div>

            {/* Booking Summary Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center text-gray-600">
                <span className="font-medium text-gray-500">Booking Reference</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(referenceCode)}
                  className="inline-flex items-center gap-1.5 font-mono font-bold text-gray-900 hover:text-primary transition-colors bg-white px-2 py-0.5 rounded border border-gray-200 cursor-pointer"
                  title="Click to copy"
                >
                  <span>{referenceCode}</span>
                  {copiedReference ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                </button>
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <span className="font-medium text-gray-500">DJ / Artist</span>
                <span className="font-semibold text-gray-900">{stageName}</span>
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <span className="font-medium text-gray-500">Event Date</span>
                <span className="font-semibold text-gray-900">
                  {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'TBD'}
                </span>
              </div>

              <div className="flex justify-between items-center text-gray-900 pt-2 border-t border-gray-200">
                <span className="font-bold text-gray-700">Total Secured in Escrow</span>
                <span className="font-bold text-base text-emerald-700 font-mono">
                  {booking.currencyCode || 'KES'} {Number(booking.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={getDjWebsiteUrl()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary hover:bg-[#d62828] text-white font-medium text-sm transition-colors cursor-pointer shadow-xs"
              >
                <span>Visit DJ Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors shadow-xs"
              >
                <Home className="w-4 h-4 text-gray-500" />
                <span>UpBeat Africa Home</span>
              </Link>
            </div>
          </div>
        )}

        {/* STATE 4: Active Checkout 2-Column Grid */}
        {!isDeclinedOrInactive && !isAlreadyPaid && !isCashApproved && (!isCashPending || overrideOnlinePayment) && (
          <div className="space-y-6">
            {/* If cash request was declined by DJ, show clear notice */}
            {isCashDeclined && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3.5 text-sm text-amber-950 shadow-2xs">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block text-amber-900">Cash Payment Request Declined</span>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {stageName} was unable to accept cash on arrival and requires online payment through UpBeat Escrow to secure this date. Please choose a payment rail below to confirm your booking.
                  </p>
                </div>
              </div>
            )}

            <div className="text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Complete Your Booking
              </h1>
              <p className="text-gray-500 text-sm">
                Reserve your date with <span className="font-semibold text-gray-900">{stageName}</span>. Funds remain safely in Escrow until the gig ends.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Event Summary (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-5">
                  <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                    Booking Summary
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-xs text-gray-500 block">Event Type</span>
                      <span className="font-medium text-gray-900">{booking.eventType || 'DJ Performance'}</span>
                    </div>

                    <div>
                      <span className="text-xs text-gray-500 block">Artist / DJ</span>
                      <span className="font-medium text-gray-900">{stageName}</span>
                    </div>

                    <div className="flex items-start gap-2 text-gray-700 pt-1">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium text-gray-900 block">
                          {booking.eventDate ? new Date(booking.eventDate).toLocaleDateString(undefined, {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 'Date to be confirmed'}
                        </span>
                        <span className="text-xs text-gray-500">{timeDisplay}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <span className="text-gray-600">{booking.address || 'Venue details on file'}</span>
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Performance Fee</span>
                      <span className="font-mono text-gray-900 font-medium">
                        {booking.currencyCode || 'KES'} {Number(booking.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Escrow Guarantee Fee</span>
                      <span className="text-emerald-600 font-semibold">FREE (0%)</span>
                    </div>
                    <div className="flex justify-between items-baseline border-t border-gray-100 pt-3">
                      <span className="text-sm font-bold text-gray-900">Total Due</span>
                      <span className="text-xl font-bold text-primary font-mono">
                        {booking.currencyCode || 'KES'} {Number(booking.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Escrow note */}
                  <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-gray-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Your funds are safely held in Escrow and only released to the DJ after the performance is completed.</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment Method (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-5">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Select Payment Method
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Choose your preferred payment gateway. Bank-grade SSL encryption.
                    </p>
                  </div>

                  {/* Gateways */}
                  <div className="space-y-3">
                    {GATEWAY_CHOICES.map((gw) => {
                      const isSelected = selectedGateway === gw.id;
                      return (
                        <button
                          key={gw.id}
                          type="button"
                          onClick={() => setSelectedGateway(gw.id)}
                          className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-primary bg-primary/[0.03] ring-2 ring-primary/20 shadow-xs'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/70'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2">
                                  {gw.id === 'PAYSTACK' && <PaystackBrandLogo />}
                                  {gw.id === 'PESAPAL' && <PesapalBrandLogo />}
                                  {gw.id === 'FLUTTERWAVE' && <FlutterwaveBrandLogo />}
                                </div>
                                <span className="text-[10px] font-bold tracking-wider uppercase text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                                  {gw.badge}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed">{gw.description}</p>
                            </div>

                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ml-2 transition-all ${
                              isSelected ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-transparent'
                            }`}>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5 items-center">
                            {gw.paymentMethods.map((m, idx) => (
                              <PaymentMethodBadge key={`${m}-${idx}`} name={m} />
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit Button */}
                  <div className="space-y-3 pt-2">
                    <Button
                      onClick={handleOnlinePayment}
                      disabled={isGeneratingLink}
                      className="w-full h-12 rounded-xl bg-primary hover:bg-[#d62828] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                    >
                      {isGeneratingLink ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Initializing Payment...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Pay {booking.currencyCode || 'KES'} {Number(booking.totalAmount || 0).toLocaleString()} Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>

                    {!isCashDeclined && (
                      <div className="text-center pt-1.5">
                        <button
                          type="button"
                          onClick={() => setCashModalOpen(true)}
                          className="text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer py-1 inline-flex items-center gap-1.5"
                        >
                          <Banknote className="w-3.5 h-3.5 text-gray-400" />
                          <span>Prefer to pay in cash? <span className="underline font-semibold text-primary">Request cash payment on arrival</span></span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cash on Arrival Request Modal */}
      {cashModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 p-6 space-y-4 shadow-xl text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Request Cash on Arrival</h3>
                <p className="text-xs text-gray-500">Pay directly to the DJ on event day</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              By requesting cash payment, you agree to pay the total amount of{' '}
              <strong className="text-gray-900">{booking.currencyCode || 'KES'} {Number(booking.totalAmount || 0).toLocaleString()}</strong>{' '}
              directly to <strong className="text-gray-900">{stageName}</strong> on event day before the performance begins.
            </p>

            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-800 leading-relaxed">
              Note: The DJ must review and approve this request. Once approved, you will receive an email confirmation and your date will be reserved.
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setCashModalOpen(false)}
                disabled={isRequestingCash}
                className="h-10 rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium px-4 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRequestCash}
                disabled={isRequestingCash}
                className="h-10 rounded-lg bg-primary hover:bg-[#d62828] text-white font-medium text-xs px-4 cursor-pointer flex items-center gap-1.5"
              >
                {isRequestingCash ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending Request...</span>
                  </>
                ) : (
                  <span>Confirm Cash Request</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClientBookingCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <LoadingSpinner />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
