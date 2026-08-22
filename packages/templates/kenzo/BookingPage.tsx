'use client';

import {motion} from 'framer-motion';
import {useForm} from 'react-hook-form';
import {useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {toast} from 'sonner';
import {useCreateBookingMutation} from '@repo/store';
import {DatePicker, AddressAutocomplete} from '@repo/ui';

const bookingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  clientPhone: z.string().min(5, 'Phone number is required'),
  address: z.string().min(3, 'Event address is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  eventTime: z.string().optional(),
  timezone: z.string().optional(),
  duration: z.string().optional(),
  eventType: z.string().min(1, 'Event type is required'),
  details: z.string().min(10, 'Please provide some event details'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingPage({content}: any) {
  // Config Data
  const bookingData = content?.booking || {
    title: 'Ready to book ?',
    description:
      'Fill out the form to request a booking. We will get back to you within 24 hours with availability and a quote.',
    contactInfo: {
      email: {title: 'Email Us', value: 'bookings@djaura.com'},
      location: {
        title: 'Based In',
        value: 'Available Worldwide',
      },
    },
  };

  const [createBooking] = useCreateBookingMutation();
  const tenantId = content?.tenantId || '';
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

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
      eventTime: '',
      timezone: 'EAT',
      duration: '4 Hours',
      eventType: '',
      details: '',
    }
  });

  const selectedDateValue = watch('eventDate');
  const currentAddress = watch('address');

  const onSubmit = async (data: BookingFormValues) => {
    setSubmitStatus(null);
    if (!tenantId) {
      toast.error('Unable to process booking: Tenant ID is missing.');
      setSubmitStatus({ type: 'error', message: 'Unable to process booking: Tenant ID is missing.' });
      return;
    }
    try {
      const timePart = data.eventTime ? `${data.eventTime}:00` : '00:00:00';
      const formattedDate = new Date(`${data.eventDate}T${timePart}`).toISOString();
      
      const enrichedDetails = [
        data.eventTime ? `Start Time: ${data.eventTime} (${data.timezone})` : null,
        data.duration ? `Duration: ${data.duration}` : null,
        `Requirements: ${data.details}`,
      ].filter(Boolean).join('\n');

      const res = await createBooking({
        tenantId,
        clientName: data.fullName,
        clientEmail: data.email,
        clientPhone: data.clientPhone,
        address: data.address,
        eventDate: formattedDate,
        eventType: data.eventType,
        eventDetails: enrichedDetails,
      }).unwrap();
      
      toast.success('Booking request sent successfully!', {
        description: "Your request has been sent to the DJ for review. You'll receive an email once approved.",
      });
      setSubmitStatus({
        type: 'success', 
        message: "Your request has been sent to the DJ for review. If your booking is accepted, you'll receive an email with a secure payment link to confirm your reservation."
      });
      reset();
    } catch (error: any) {
      const errorMsg = error?.data?.message || 'Failed to send booking request. Please try again.';
      toast.error(errorMsg);
      setSubmitStatus({ type: 'error', message: errorMsg });
    }
  };

  return (
    <section className="bg-[#f4f4f4] py-[100px] min-h-screen flex items-center justify-center font-sans">
      <div className="max-w-[1200px] w-full mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] lg:gap-[100px] items-center">
          {/* Left Side: Text & Info */}
          <motion.div
            initial={{opacity: 0, x: -30}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.6}}
            className="flex flex-col gap-[40px] max-w-[480px]">
            <div>
              <h2 className="text-[36px] md:text-[42px] font-bold text-[#111111] mb-[16px] tracking-tight">
                {content?.djName ? `Ready to book ${content.djName}?` : bookingData.title}
              </h2>
              <p className="text-[#888888] text-[15px] md:text-[16px] leading-relaxed">
                {bookingData.description}
              </p>
            </div>

            <div className="flex flex-col gap-[30px]">
              {/* Email Contact Block */}
              <div className="flex items-center gap-[16px]">
                <div className="w-[48px] h-[48px] rounded-full bg-[#e5e5e5] flex items-center justify-center shrink-0 text-[#111111]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#111111]">
                    {bookingData.contactInfo?.email?.title || 'Email Us'}
                  </h4>
                  <p className="text-[14px] text-[#888888]">
                    {bookingData.contactInfo?.email?.value || 'bookings@upbeat.africa'}
                  </p>
                </div>
              </div>

              {/* Location Contact Block */}
              <div className="flex items-center gap-[16px]">
                <div className="w-[48px] h-[48px] rounded-full bg-[#e5e5e5] flex items-center justify-center shrink-0 text-[#111111]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#111111]">
                    {bookingData.contactInfo?.location?.title || 'Based In'}
                  </h4>
                  <p className="text-[14px] text-[#888888]">
                    {bookingData.contactInfo?.location?.value || 'Available for bookings worldwide'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form Box */}
          <motion.div
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, delay: 0.2}}
            className="bg-white p-[32px] md:p-[48px] rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-[20px]"
              noValidate>

              {submitStatus && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-[14px] font-medium leading-relaxed p-[16px] rounded-[12px] flex items-start gap-3 ${
                    submitStatus.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
                      : 'bg-red-50 text-red-900 border border-red-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    submitStatus.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {submitStatus.type === 'success' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{submitStatus.type === 'success' ? 'Request Sent Successfully!' : 'Submission Failed'}</p>
                    <p className="text-[13px] mt-0.5 opacity-90">{submitStatus.message}</p>
                  </div>
                </motion.div>
              )}
              
              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-bold text-[#111111]">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    {...register('fullName')}
                    className={`w-full bg-[#fafafa] border ${
                      errors.fullName ? 'border-red-500' : 'border-[#e5e5e5]'
                    } rounded-[8px] px-[16px] py-[12px] text-[14px] text-[#111111] placeholder-[#a3a3a3] outline-none focus:border-[var(--primary)] transition-colors`}
                  />
                  {errors.fullName && (
                    <span className="text-red-500 text-[12px]">
                      {errors.fullName.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-bold text-[#111111]">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    className={`w-full bg-[#fafafa] border ${
                      errors.email ? 'border-red-500' : 'border-[#e5e5e5]'
                    } rounded-[8px] px-[16px] py-[12px] text-[14px] text-[#111111] placeholder-[#a3a3a3] outline-none focus:border-[var(--primary)] transition-colors`}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-[12px]">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Phone Number & Venue Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-bold text-[#111111]">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +234 801 234 5678"
                    {...register('clientPhone')}
                    className={`w-full bg-[#fafafa] border ${
                      errors.clientPhone ? 'border-red-500' : 'border-[#e5e5e5]'
                    } rounded-[8px] px-[16px] py-[12px] text-[14px] text-[#111111] placeholder-[#a3a3a3] outline-none focus:border-[var(--primary)] transition-colors`}
                  />
                  {errors.clientPhone && (
                    <span className="text-red-500 text-[12px]">
                      {errors.clientPhone.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-bold text-[#111111]">
                    Venue / Event Address <span className="text-red-500">*</span>
                  </label>
                  <AddressAutocomplete
                    value={currentAddress}
                    onChange={(val) => setValue('address', val, { shouldValidate: true })}
                    onSelectTimezone={(tz) => setValue('timezone', tz)}
                    placeholder="Search venue or address..."
                    inputClassName={`w-full bg-[#fafafa] border ${
                      errors.address ? '!border-red-500' : 'border-[#e5e5e5]'
                    } rounded-[8px] px-[16px] py-[12px] h-[46px] text-[14px] text-[#111111] placeholder-[#a3a3a3] outline-none focus:border-[var(--primary)]`}
                  />
                  {errors.address && (
                    <span className="text-red-500 text-[12px]">
                      {errors.address.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 3: Event Date & Event Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-bold text-[#111111]">
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    date={selectedDateValue}
                    onSelect={(d?: Date) => {
                      if (d) {
                        const y = d.getFullYear();
                        const m = String(d.getMonth() + 1).padStart(2, '0');
                        const day = String(d.getDate()).padStart(2, '0');
                        setValue('eventDate', `${y}-${m}-${day}`, { shouldValidate: true });
                      } else {
                        setValue('eventDate', '', { shouldValidate: true });
                      }
                    }}
                    placeholder="Select event date"
                    minDate={new Date()}
                    buttonClassName={`w-full bg-[#fafafa] border ${
                      errors.eventDate ? '!border-red-500' : 'border-[#e5e5e5]'
                    } rounded-[8px] px-[16px] py-[12px] h-[46px] text-[14px] text-left`}
                  />
                  {errors.eventDate && (
                    <span className="text-red-500 text-[12px]">
                      {errors.eventDate.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-bold text-[#111111]">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      {...register('eventType')}
                      className={`w-full bg-[#fafafa] border ${
                        errors.eventType ? 'border-red-500' : 'border-[#e5e5e5]'
                      } rounded-[8px] px-[16px] py-[12px] text-[14px] text-[#111111] outline-none focus:border-[var(--primary)] transition-colors appearance-none`}>
                      <option value="" disabled hidden>
                        Select event type
                      </option>
                      <option value="Wedding">Wedding</option>
                      <option value="Club / Lounge Gig">Club / Lounge Gig</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Private">Private</option>
                      <option value="Concert / Festival">Concert / Festival</option>
                      <option value="Birthday Celebration">Birthday Celebration</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-[16px] flex items-center pointer-events-none">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#a3a3a3"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  {errors.eventType && (
                    <span className="text-red-500 text-[12px]">
                      {errors.eventType.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 4: Event Start Time & Timezone & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-bold text-[#111111]">
                    Start Time
                  </label>
                  <input
                    type="time"
                    {...register('eventTime')}
                    className="w-full bg-[#fafafa] border border-[#e5e5e5] rounded-[8px] px-[16px] py-[12px] h-[46px] text-[14px] text-[#111111] outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-bold text-[#111111]">
                    Timezone
                  </label>
                  <select
                    {...register('timezone')}
                    className="w-full bg-[#fafafa] border border-[#e5e5e5] rounded-[8px] px-[16px] py-[12px] h-[46px] text-[14px] text-[#111111] outline-none focus:border-[var(--primary)] transition-colors cursor-pointer"
                  >
                    <option value="WAT">WAT (Nigeria/West Africa)</option>
                    <option value="EAT">EAT (Kenya/East Africa)</option>
                    <option value="GMT">GMT (Ghana)</option>
                    <option value="SAST">SAST (South Africa)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-bold text-[#111111]">
                    Estimated Duration
                  </label>
                  <select
                    {...register('duration')}
                    className="w-full bg-[#fafafa] border border-[#e5e5e5] rounded-[8px] px-[16px] py-[12px] h-[46px] text-[14px] text-[#111111] outline-none focus:border-[var(--primary)] transition-colors cursor-pointer"
                  >
                    <option value="1 Hour">1 Hour</option>
                    <option value="2 Hours">2 Hours</option>
                    <option value="3 Hours">3 Hours</option>
                    <option value="4 Hours">4 Hours</option>
                    <option value="5 Hours">5 Hours</option>
                    <option value="6 Hours">6 Hours</option>
                    <option value="8 Hours">8 Hours</option>
                    <option value="10+ Hours (Full Day)">10+ Hours (Full Day)</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Event Details */}
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-bold text-[#111111]">
                  Event Details & Music Preferences <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell me about the event, crowd size, preferred music genres (Afrobeats, Amapiano, Hip Hop, House), sound equipment setup..."
                  {...register('details')}
                  className={`w-full bg-[#fafafa] border ${
                    errors.details ? 'border-red-500' : 'border-[#e5e5e5]'
                  } rounded-[8px] px-[16px] py-[12px] text-[14px] text-[#111111] placeholder-[#a3a3a3] outline-none focus:border-[var(--primary)] transition-colors resize-none`}></textarea>
                {errors.details && (
                  <span className="text-red-500 text-[12px]">
                    {errors.details.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{scale: isSubmitting ? 1 : 1.01}}
                whileTap={{scale: isSubmitting ? 1 : 0.99}}
                className="w-full bg-[var(--primary)] hover:opacity-90 text-white py-[15px] rounded-[10px] font-bold text-[16px] transition-all mt-[8px] flex justify-center items-center gap-2 shadow-lg shadow-[var(--primary)]/20 disabled:opacity-70 cursor-pointer">
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    Sending Booking Request...
                  </>
                ) : (
                  'Send Booking Request'
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
