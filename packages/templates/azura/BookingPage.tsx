'use client';

import {useForm} from 'react-hook-form';
import {useEffect, useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {toast} from 'sonner';
import {useInitiateBookingMutation} from '@repo/store';
import {DatePicker, AddressAutocomplete} from '@repo/ui';
import BookingOtpModal from '../shared/BookingOtpModal';
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

const bookingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  clientPhone: z.string().min(5, 'Phone number is required'),
  address: z.string().min(3, 'Event venue or city is required'),
  eventDate: z.string().min(1, 'Please select event date'),
  eventTime: z.string().optional(),
  duration: z.string().optional(),
  eventType: z.string().min(1, 'Please select event category'),
  details: z
    .string()
    .min(6, 'Please provide some event details or music requests'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const EVENT_TYPES = [
  'Wedding',
  'Club / Lounge',
  'Corporate Event',
  'Concert / Festival',
  'Birthday Party',
  'Private Gathering',
  'Other',
];

const DURATION_OPTIONS = [
  '2 Hours',
  '4 Hours (Standard)',
  '6 Hours',
  'Full Day (8h+)',
];

export default function BookingPage({content}: any) {
  const [initiateBooking, {isLoading: isInitiating}] =
    useInitiateBookingMutation();
  const tenantId = content?.tenantId || '';
  const djName = content?.djName || 'The DJ';
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // OTP Modal state
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [pendingClientEmail, setPendingClientEmail] = useState('');
  const [detectedTimezone, setDetectedTimezone] = useState('');

  useEffect(() => {
    if (typeof Intl !== 'undefined') {
      setDetectedTimezone(
        Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      );
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema) as any,
    defaultValues: {
      fullName: '',
      email: '',
      clientPhone: '',
      address: '',
      eventDate: '',
      eventTime: '20:00',
      duration: '4 Hours (Standard)',
      eventType: '',
      details: '',
    },
  });

  const selectedEventType = watch('eventType');
  const selectedDuration = watch('duration');
  const selectedDateValue = watch('eventDate');
  const currentAddress = watch('address');

  const onSubmit = async (data: BookingFormValues) => {
    setSubmitStatus(null);
    if (!tenantId) {
      toast.error('Unable to process booking: Tenant ID is missing.');
      setSubmitStatus({type: 'error', message: 'Tenant ID is missing.'});
      return;
    }
    try {
      const timePart = data.eventTime ? `${data.eventTime}:00` : '00:00:00';
      // Use local timezone to convert to UTC
      const localDateTime = new Date(`${data.eventDate}T${timePart}`);
      const formattedDate = localDateTime.toISOString();

      const clientTz =
        typeof Intl !== 'undefined'
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : '';
      const clientFormattedTime = data.eventTime
        ? localDateTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
        : '';

      const enrichedDetails = [
        data.eventTime
          ? `Client Local Time: ${clientFormattedTime}${clientTz ? ` (${clientTz})` : ''}`
          : null,
        data.duration ? `Duration: ${data.duration}` : null,
        `Requirements: ${data.details}`,
      ]
        .filter(Boolean)
        .join('\n');

      const res = await initiateBooking({
        tenantId,
        clientName: data.fullName,
        clientEmail: data.email,
        clientPhone: data.clientPhone,
        address: data.address,
        eventDate: formattedDate,
        eventTimezone: clientTz || undefined,
        currencyCode: content?.currencyCode || undefined,
        eventType: data.eventType,
        eventDetails: enrichedDetails,
      }).unwrap();

      if (res?.data?.verificationToken) {
        setVerificationToken(res.data.verificationToken);
        setPendingClientEmail(data.email);
        setOtpModalOpen(true);
        toast.success('Verification code sent to your email!');
      }
    } catch (error: any) {
      const errorMsg =
        error?.data?.message ||
        'Failed to send verification code. Please try again.';
      toast.error(errorMsg);
      setSubmitStatus({type: 'error', message: errorMsg});
    }
  };

  const handleBookingVerified = () => {
    toast.success('Booking request submitted successfully!', {
      description:
        "Your request has been sent to the DJ for review. You'll receive an email once approved.",
    });
    setSubmitStatus({
      type: 'success',
      message:
        "Your booking request has been verified and sent to the DJ for review. Once accepted, you will receive an email with the artist's quotation and access to your booking portal to coordinate your event and view direct settlement instructions.",
    });
    reset();
  };

  return (
    <section className="bg-[#f0f0f0] py-8 sm:py-14 lg:py-20 font-sans text-[#111111] min-h-screen flex items-center justify-center">
      <div className="max-w-[860px] w-full mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-5 sm:mb-8">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
            Direct Booking
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0f0f0f] tracking-tight mb-1.5">
            Book <span className="text-[var(--primary)]">{djName}</span> For
            Your Event
          </h1>
          <p className="text-[#666666] text-xs sm:text-sm max-w-[560px] mx-auto leading-relaxed px-2">
            Fill out the form below with your event details, location, and
            preferred music vibe. The DJ team will review and confirm
            availability.
          </p>
        </div>

        {/* Form Card (Sleek, Tailored, Professional) */}
        <div className="bg-white p-4 sm:p-7 md:p-8 rounded-sm border border-[#e5e5e5] shadow-xs">
          {submitStatus && (
            <div
              className={`mb-5 p-3.5 rounded-sm flex items-start gap-2.5 text-xs sm:text-sm border ${
                submitStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                  : 'bg-red-50 text-red-950 border-red-200'
              }`}>
              {submitStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">
                  {submitStatus.type === 'success'
                    ? 'Booking Request Submitted!'
                    : 'Submission Error'}
                </p>
                <p className="mt-0.5 opacity-90 leading-relaxed">
                  {submitStatus.message}
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-5"
            noValidate>
            {/* Field 1: Event Type (Sleek, compact dropdown with chevron) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111111] uppercase tracking-wide block">
                Event Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('eventType')}
                  className={`w-full bg-white border ${
                    errors.eventType ? '!border-red-500' : 'border-[#d4d4d4]'
                  } rounded-sm pl-3 pr-9 h-10 text-xs sm:text-sm ${
                    selectedEventType
                      ? 'text-[#111111] font-medium'
                      : 'text-[#999999]'
                  } outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 transition-all cursor-pointer appearance-none`}>
                  <option value="" disabled>
                    Select event type...
                  </option>
                  {EVENT_TYPES.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="text-[#111111] font-normal py-1">
                      {type}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400">
                  <ChevronDown className="w-4 h-4 stroke-[2]" />
                </div>
              </div>
              {errors.eventType && (
                <span className="text-red-500 text-xs block">
                  {errors.eventType.message}
                </span>
              )}
            </div>

            {/* Field 2: Date & Time (Stacked on mobile, 2 cols on tablet+) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111111] uppercase tracking-wide block">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  date={selectedDateValue}
                  onSelect={(d?: Date) => {
                    if (d) {
                      const y = d.getFullYear();
                      const m = String(d.getMonth() + 1).padStart(2, '0');
                      const day = String(d.getDate()).padStart(2, '0');
                      setValue('eventDate', `${y}-${m}-${day}`, {
                        shouldValidate: true,
                      });
                    } else {
                      setValue('eventDate', '', {shouldValidate: true});
                    }
                  }}
                  placeholder="Select event date"
                  minDate={new Date()}
                  buttonClassName={`w-full bg-white border ${
                    errors.eventDate ? '!border-red-500' : '!border-[#d4d4d4]'
                  } !rounded-sm !px-3 !h-10 text-xs sm:text-sm text-left text-[#111111] hover:!border-[#999999] focus:!border-[var(--primary)] transition-all`}
                />
                {errors.eventDate && (
                  <span className="text-red-500 text-xs block">
                    {errors.eventDate.message}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#111111] uppercase tracking-wide flex items-center justify-between">
                  <span>Start Time</span>
                  {detectedTimezone && (
                    <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      Local: {detectedTimezone}
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    {...register('eventTime')}
                    className="w-full bg-white border border-[#d4d4d4] rounded-sm px-3 h-10 text-xs sm:text-sm text-[#111111] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 transition-all cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Field 3: Venue Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111111] uppercase tracking-wide block">
                Venue Address or Location{' '}
                <span className="text-red-500">*</span>
              </label>
              <AddressAutocomplete
                value={currentAddress}
                onChange={(val) =>
                  setValue('address', val, {shouldValidate: true})
                }
                placeholder="Search hotel, club, hall, or street address..."
                inputClassName={`w-full bg-white border ${
                  errors.address ? '!border-red-500' : 'border-[#d4d4d4]'
                } rounded-sm px-3 h-10 text-xs sm:text-sm text-[#111111] placeholder:text-[#999999] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 transition-all`}
              />
              {errors.address && (
                <span className="text-red-500 text-xs block">
                  {errors.address.message}
                </span>
              )}
            </div>

            {/* Field 4: Duration (Clean compact pills with dynamic primary color) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#111111] uppercase tracking-wide block">
                Estimated Performance Duration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                {DURATION_OPTIONS.map((dur) => {
                  const isSelected = selectedDuration === dur;
                  return (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setValue('duration', dur)}
                      className={`h-8 sm:h-8.5 px-3 rounded-sm text-xs font-medium border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-xs'
                          : 'border-[#d8d8d8] bg-[#fafafa] text-[#444444] hover:border-[#999999] hover:bg-[#f0f0f0]'
                      }`}>
                      {dur}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 5: Details & Music */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#111111] uppercase tracking-wide block">
                Event Notes & Music Preferences{' '}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Preferred genres (Afrobeats, Amapiano, Hip Hop, etc.), crowd vibe, special entrance song, sound setup on-site..."
                {...register('details')}
                className={`w-full bg-white border ${
                  errors.details ? 'border-red-500' : 'border-[#d4d4d4]'
                } rounded-sm p-2.5 sm:p-3 text-xs sm:text-sm text-[#111111] placeholder:text-[#999999] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 transition-all resize-none leading-relaxed`}
              />
              {errors.details && (
                <span className="text-red-500 text-xs block">
                  {errors.details.message}
                </span>
              )}
            </div>

            {/* Field 6: Client Contact Details */}
            <div className="pt-3 border-t border-[#eeeeee] space-y-3">
              <p className="text-xs font-semibold text-[#111111] uppercase tracking-wide">
                Your Contact Information
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#555555] font-medium block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    {...register('fullName')}
                    className={`w-full bg-white border ${
                      errors.fullName ? 'border-red-500' : 'border-[#d4d4d4]'
                    } rounded-sm px-3 h-10 text-xs sm:text-sm text-[#111111] placeholder:text-[#999999] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 transition-all`}
                  />
                  {errors.fullName && (
                    <span className="text-red-500 text-xs block">
                      {errors.fullName.message}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-[#555555] font-medium block">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +254 712 345 678"
                    {...register('clientPhone')}
                    className={`w-full bg-white border ${
                      errors.clientPhone ? 'border-red-500' : 'border-[#d4d4d4]'
                    } rounded-sm px-3 h-10 text-xs sm:text-sm text-[#111111] placeholder:text-[#999999] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 transition-all`}
                  />
                  {errors.clientPhone && (
                    <span className="text-red-500 text-xs block">
                      {errors.clientPhone.message}
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs text-[#555555] font-medium block">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="your-email@example.com"
                    {...register('email')}
                    className={`w-full bg-white border ${
                      errors.email ? 'border-red-500' : 'border-[#d4d4d4]'
                    } rounded-sm px-3 h-10 text-xs sm:text-sm text-[#111111] placeholder:text-[#999999] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20 transition-all`}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs block">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Escrow Note */}
            <div className="pt-1 flex items-center gap-2 text-xs text-[#666666]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                No upfront payment required now. The DJ will review and send
                your booking quote.
              </span>
            </div>

            {/* Submit Button (Uses Dynamic Primary Color var(--primary), sleek and fit) */}
            <button
              type="submit"
              disabled={isSubmitting || isInitiating}
              className="w-full h-10.5 sm:h-11 bg-[var(--primary)] hover:opacity-95 active:scale-[0.99] text-white font-semibold text-sm rounded-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer">
              {isSubmitting || isInitiating ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <span>Submit Booking Request</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <BookingOtpModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        verificationToken={verificationToken}
        clientEmail={pendingClientEmail}
        onSuccess={handleBookingVerified}
      />
    </section>
  );
}
