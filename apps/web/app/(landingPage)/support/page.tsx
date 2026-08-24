'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState, useCreateTicketMutation } from '@repo/store';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(2, 'Subject is required'),
  issue: z.string().min(10, 'Please describe your issue in at least 10 characters'),
});

type FormValues = z.infer<typeof formSchema>;

const issueTypeMap: Record<string, string> = {
  billing: 'Billing Issue',
  technical: 'Technical Support',
  account: 'Account Management',
  booking: 'Booking Problem',
  payment: 'Payment Issue',
  other: 'Other',
};

export default function SupportPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [createTicket, { isLoading }] = useCreateTicketMutation();
  const [issueType, setIssueType] = React.useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '',
      email: user?.email ?? '',
    },
  });

  // Update defaults if user logs in after component mounts
  React.useEffect(() => {
    if (user) {
      reset({
        fullName: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        email: user.email,
        subject: '',
        issue: '',
      });
      setIssueType('');
    }
  }, [user, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      const issueLabel = issueType ? issueTypeMap[issueType] ?? issueType : '';
      const issueText = issueLabel ? `[${issueLabel}] ${data.issue}` : data.issue;

      await createTicket({
        fullName: data.fullName,
        email: data.email,
        subject: data.subject,
        issue: issueText,
      }).unwrap();

      toast.success(
        `Support ticket submitted! We'll get back to you at ${data.email} within 24 hours.`,
        { duration: 5000 }
      );
      reset({
        fullName: user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '',
        email: user?.email ?? '',
        subject: '',
        issue: '',
      });
      setIssueType('');
    } catch (err: any) {
      const msg = err?.data?.message ?? err?.message ?? 'Failed to submit ticket. Please try again.';
      toast.error(msg);
    }
  };

  const inputCls = (hasError: boolean) =>
    `w-full px-4 py-3 border text-sm placeholder:text-gray-400 outline-none transition-colors ${
      hasError
        ? 'border-red-500 focus:border-red-500 bg-red-50'
        : 'border-gray-200 focus:border-gray-400 bg-white'
    }`;

  return (
    <section className="bg-[#f2f2f2] min-h-screen py-20 px-6 flex items-center justify-center font-sans">
      <div className="max-w-250 w-full mx-auto grid md:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
        {/* Left Column */}
        <div className="pt-4">
          <h2 className="text-[32px] font-semibold text-gray-900 mb-4 tracking-tight">
            How Can We Help?
          </h2>
          <p className="text-gray-500 text-[17px] leading-relaxed mb-8">
            Have a question or need help? Send us a message and our team will get
            back to you within 24 hours.
          </p>

          {user ? (
            <div className="bg-white border border-gray-200 p-4 flex items-start gap-3 text-sm">
              <span className="text-green-500 mt-0.5 shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </span>
              <div>
                <p className="font-semibold text-gray-800">Logged in as {user.email}</p>
                <p className="text-gray-500 mt-0.5">Your contact details have been pre-filled. A confirmation email will be sent to this address.</p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 p-4 flex items-start gap-3 text-sm">
              <span className="text-amber-500 mt-0.5 shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </span>
              <div>
                <p className="font-semibold text-gray-800">You&apos;re not logged in</p>
                <p className="text-gray-500 mt-0.5">
                  You can still submit a ticket — just enter your email so we can reply.
                  <a href="/auth/login" className="text-primary font-medium ml-1 underline underline-offset-2">
                    Login for faster support →
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column — Form */}
        <div className="bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="support-fullName" className="block text-[13px] font-bold text-gray-800 mb-2">
                Full Name
              </label>
              <input
                id="support-fullName"
                type="text"
                placeholder="Enter your full name"
                className={inputCls(!!errors.fullName)}
                readOnly={!!user}
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1.5">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="support-email" className="block text-[13px] font-bold text-gray-800 mb-2">
                Email Address
              </label>
              <input
                id="support-email"
                type="email"
                placeholder="your@email.com"
                className={inputCls(!!errors.email)}
                readOnly={!!user}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
              )}
              {user && (
                <p className="text-xs text-gray-400 mt-1">Confirmation will be sent here.</p>
              )}
            </div>

            {/* Issue Type */}
            <div>
              <label htmlFor="support-issue-type" className="block text-[13px] font-bold text-gray-800 mb-2">
                Issue Type
              </label>
              <div className="relative">
                <select
                  id="support-issue-type"
                  value={issueType}
                  onChange={e => setIssueType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 text-sm text-gray-500 outline-none transition-colors appearance-none bg-transparent focus:border-gray-400"
                >
                  <option value="" disabled>Select a category</option>
                  {Object.entries(issueTypeMap).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="support-subject" className="block text-[13px] font-bold text-gray-800 mb-2">
                Subject
              </label>
              <input
                id="support-subject"
                type="text"
                placeholder="Brief summary of your issue"
                className={inputCls(!!errors.subject)}
                {...register('subject')}
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1.5">{errors.subject.message}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="support-message" className="block text-[13px] font-bold text-gray-800 mb-2">
                Describe Your Issue
              </label>
              <textarea
                id="support-message"
                rows={5}
                placeholder="Please provide as much detail as possible..."
                className={inputCls(!!errors.issue)}
                style={{ resize: 'vertical' }}
                {...register('issue')}
              />
              {errors.issue && (
                <p className="text-red-500 text-xs mt-1.5">{errors.issue.message}</p>
              )}
            </div>

            <button
              type="submit"
              id="support-submit-btn"
              disabled={isLoading}
              className="w-full bg-primary duration-300 cursor-pointer text-white py-3.5 text-[15px] font-semibold hover:bg-[#e03939] transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Submitting...' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
