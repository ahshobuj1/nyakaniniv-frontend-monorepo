'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useCreateBookingMutation } from '@repo/store';

const bookingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  clientPhone: z.string().min(5, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  eventType: z.string().min(1, 'Event type is required'),
  details: z.string().min(10, 'Please provide some event details'),
});


type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingPage({ content }: any) {
  const [createBooking] = useCreateBookingMutation();
  const tenantId = content?.tenantId || '';
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      eventType: "",
    }
  });

  const onSubmit = async (data: BookingFormValues) => {
    setSubmitStatus(null);
    if (!tenantId) {
      toast.error('Unable to process booking: Tenant ID is missing.');
      setSubmitStatus({ type: 'error', message: 'Unable to process booking: Tenant ID is missing.' });
      return;
    }
    try {
      const res = await createBooking({
        tenantId,
        clientName: data.fullName,
        clientEmail: data.email,
        clientPhone: data.clientPhone,
        address: data.address,
        eventDate: new Date(data.eventDate).toISOString(),
        eventType: data.eventType,
        eventDetails: data.details,
      }).unwrap();
      toast.success(res?.message || 'Booking request sent successfully!');
     
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
    <section className="bg-[#f5f5f5] py-[80px] min-h-screen flex items-center justify-center font-sans">
      <div className="max-w-[800px] w-full mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-[40px]"
        >
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#111111] mb-[12px]">
            Ready to book DJ Aura?
          </h2>
          <p className="text-[#787878] text-[16px] max-w-[550px] mx-auto leading-relaxed">
            Fill out the form below with your event details, and my team will
            get back to you with availability and a tailored quote.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white p-[32px] md:p-[48px] rounded-[16px] shadow-sm"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[24px]" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              <div className="flex flex-col gap-[8px]">
                <label className="text-[13px] font-bold text-[#111111]">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  {...register('fullName')}
                  className={`w-full bg-white border ${
                    errors.fullName ? 'border-red-500' : 'border-[#e5e5e5]'
                  } rounded-[8px] px-[16px] py-[12px] text-[14px] text-[#111111] placeholder-[#a3a3a3] outline-none focus:border-[var(--primary)] transition-colors`}
                />
                {errors.fullName && (
                  <span className="text-red-500 text-[12px]">{errors.fullName.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="text-[13px] font-bold text-[#111111]">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  className={`w-full bg-white border ${
                    errors.email ? 'border-red-500' : 'border-[#e5e5e5]'
                  } rounded-[8px] px-[16px] py-[12px] text-[14px] text-[#111111] placeholder-[#a3a3a3] outline-none focus:border-[var(--primary)] transition-colors`}
                />
                {errors.email && (
                  <span className="text-red-500 text-[12px]">{errors.email.message}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              <div className="flex flex-col gap-[8px]">
                <label className="text-[13px] font-bold text-[#111111]">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  {...register('clientPhone')}
                  className={`w-full bg-white border ${
                    errors.clientPhone ? 'border-red-500' : 'border-[#e5e5e5]'
                  } rounded-[8px] px-[16px] py-[12px] text-[14px] text-[#111111] placeholder-[#a3a3a3] outline-none focus:border-[var(--primary)] transition-colors`}
                />
                {errors.clientPhone && (
                  <span className="text-red-500 text-[12px]">{errors.clientPhone.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="text-[13px] font-bold text-[#111111]">Address / Location</label>
                <input
                  type="text"
                  placeholder="Enter event address"
                  {...register('address')}
                  className={`w-full bg-white border ${
                    errors.address ? 'border-red-500' : 'border-[#e5e5e5]'
                  } rounded-[8px] px-[16px] py-[12px] text-[14px] text-[#111111] placeholder-[#a3a3a3] outline-none focus:border-[var(--primary)] transition-colors`}
                />
                {errors.address && (
                  <span className="text-red-500 text-[12px]">{errors.address.message}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              <div className="flex flex-col gap-[8px]">
                <label className="text-[13px] font-bold text-[#111111]">Event Date</label>
                <div className="relative">
                  <input
                    type="date"
                    {...register('eventDate')}
                    className={`w-full bg-white border ${
                      errors.eventDate ? 'border-red-500' : 'border-[#e5e5e5]'
                    } rounded-[8px] px-[16px] py-[12px] text-[14px] text-[#111111] outline-none focus:border-[var(--primary)] transition-colors appearance-none`}
                  />
                  {errors.eventDate && (
                    <span className="text-red-500 text-[12px] mt-1 block">{errors.eventDate.message}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="text-[13px] font-bold text-[#111111]">Event Type</label>
                <div className="relative">
                  <select
                    {...register('eventType')}
                    className={`w-full bg-white border ${
                      errors.eventType ? 'border-red-500' : 'border-[#e5e5e5]'
                    } rounded-[8px] px-[16px] py-[12px] text-[14px] text-[#111111] outline-none focus:border-[var(--primary)] transition-colors appearance-none`}
                  >
                    <option value="" disabled hidden>Select type</option>
                    <option value="wedding">Wedding</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="club">Club Gig</option>
                    <option value="private">Private Party</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-[16px] flex items-center pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
                {errors.eventType && (
                  <span className="text-red-500 text-[12px]">{errors.eventType.message}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-[8px]">
              <label className="text-[13px] font-bold text-[#111111]">Event Details & Requirements</label>
              <textarea
                rows={5}
                placeholder="Tell me about the venue, expected crowd size, and music expectations..."
                {...register('details')}
                className={`w-full bg-white border ${
                  errors.details ? 'border-red-500' : 'border-[#e5e5e5]'
                } rounded-[8px] px-[16px] py-[12px] text-[14px] text-[#111111] placeholder-[#a3a3a3] outline-none focus:border-[var(--primary)] transition-colors resize-none`}
              ></textarea>
              {errors.details && (
                <span className="text-red-500 text-[12px]">{errors.details.message}</span>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full bg-[var(--primary)] text-white py-[14px] rounded-[8px] font-bold text-[16px] transition-colors mt-[8px] flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Book Now'
              )}
            </motion.button>

            {submitStatus && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className={`text-center text-[14px] font-medium leading-relaxed mt-[8px] p-[12px] rounded-[8px] ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                {submitStatus.message}
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}