'use client';

import {motion} from 'framer-motion';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {toast} from 'sonner';

const bookingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  eventDate: z.string().min(1, 'Event date is required'),
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
        value: 'Los Angeles, CA - Available Worldwide',
      },
    },
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(data);
    toast.success('Booking request sent successfully!');
    reset();
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
                {bookingData.title}
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
                    {bookingData.contactInfo.email.title}
                  </h4>
                  <p className="text-[14px] text-[#888888]">
                    {bookingData.contactInfo.email.value}
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
                    {bookingData.contactInfo.location.title}
                  </h4>
                  <p className="text-[14px] text-[#888888]">
                    {bookingData.contactInfo.location.value}
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
              className="flex flex-col gap-[24px]"
              noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                {/* Full Name */}
                <div className="flex flex-col gap-[8px]">
                  <label className="text-[13px] font-bold text-[#111111]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    {...register('fullName')}
                    className={`w-full bg-white border ${
                      errors.fullName ? 'border-red-500' : 'border-[#e5e5e5]'
                    } rounded-[8px] px-[16px] py-[12px] text-[14px] text-[#111111] placeholder-[#a3a3a3] outline-none focus:border-[var(--primary)] transition-colors`}
                  />
                  {errors.fullName && (
                    <span className="text-red-500 text-[12px]">
                      {errors.fullName.message}
                    </span>
                  )}
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-[8px]">
                  <label className="text-[13px] font-bold text-[#111111]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    className={`w-full bg-white border ${
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                {/* Event Date */}
                <div className="flex flex-col gap-[8px]">
                  <label className="text-[13px] font-bold text-[#111111]">
                    Event Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      {...register('eventDate')}
                      className={`w-full bg-white border ${
                        errors.eventDate ? 'border-red-500' : 'border-[#e5e5e5]'
                      } rounded-[8px] px-[16px] py-[12px] text-[14px] text-[#111111] outline-none focus:border-[var(--primary)] transition-colors appearance-none`}
                    />
                  </div>
                  {errors.eventDate && (
                    <span className="text-red-500 text-[12px]">
                      {errors.eventDate.message}
                    </span>
                  )}
                </div>

                {/* Event Type */}
                <div className="flex flex-col gap-[8px]">
                  <label className="text-[13px] font-bold text-[#111111]">
                    Event Type
                  </label>
                  <div className="relative">
                    <select
                      {...register('eventType')}
                      className={`w-full bg-white border ${
                        errors.eventType ? 'border-red-500' : 'border-[#e5e5e5]'
                      } rounded-[8px] px-[16px] py-[12px] text-[14px] text-[#111111] outline-none focus:border-[var(--primary)] transition-colors appearance-none`}>
                      <option value="" disabled selected hidden>
                        Select type
                      </option>
                      <option value="wedding">Wedding</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="club">Club Gig</option>
                      <option value="private">Private Party</option>
                      <option value="other">Other</option>
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

              {/* Event Details */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[13px] font-bold text-[#111111]">
                  Event Details & Requirements
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell me about the venue, expected crowd size, and music expectations..."
                  {...register('details')}
                  className={`w-full bg-white border ${
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
                whileHover={{scale: isSubmitting ? 1 : 1.02}}
                whileTap={{scale: isSubmitting ? 1 : 0.98}}
                className="w-full bg-[var(--primary)] text-white py-[14px] rounded-[8px] font-bold text-[15px] transition-colors mt-[8px] flex justify-center items-center gap-2 disabled:opacity-70">
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
                    Processing...
                  </>
                ) : (
                  'Book Now'
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
