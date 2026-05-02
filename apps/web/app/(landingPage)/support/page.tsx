'use client';

import React from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {toast} from 'sonner';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  subject: z.string().min(2, 'Subject is required'),
  issue: z.string().min(1, 'Please select an issue'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Message sent successfully! We will get back to you soon.');
    reset();
  };

  return (
    <section className="bg-[#f2f2f2] min-h-screen py-20 px-6 flex items-center justify-center font-sans">
      <div className="max-w-250 w-full mx-auto grid md:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
        <div className="pt-4">
          <h2 className="text-[32px] font-semibold text-gray-900 mb-4 tracking-tight">
            How Can We Help?
          </h2>
          <p className="text-gray-500 text-[17px] leading-relaxed">
            Have a question or need help with a trade? Send us a message and our
            team will get back to you within 24 hours.
          </p>
        </div>

        <div className="bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-[13px] font-bold text-gray-800 mb-2">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border text-sm placeholder:text-gray-400 outline-none transition-colors ${
                  errors.fullName
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:border-gray-400'
                }`}
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-[13px] font-bold text-gray-800 mb-2">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                placeholder="What do you need help with?"
                className={`w-full px-4 py-3 border text-sm placeholder:text-gray-400 outline-none transition-colors ${
                  errors.subject
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:border-gray-400'
                }`}
                {...register('subject')}
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="issue"
                className="block text-[13px] font-bold text-gray-800 mb-2">
                Issue
              </label>
              <div className="relative">
                <select
                  id="issue"
                  className={`w-full px-4 py-3 border text-sm text-gray-500 outline-none transition-colors appearance-none bg-transparent ${
                    errors.issue
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:border-gray-400'
                  }`}
                  {...register('issue')}
                  defaultValue="">
                  <option value="" disabled hidden>
                    choose the issue
                  </option>
                  <option value="billing">Billing Issue</option>
                  <option value="technical">Technical Support</option>
                  <option value="account">Account Management</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
              {errors.issue && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.issue.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-[13px] font-bold text-gray-800 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Describe your question or issue in detail..."
                className={`w-full px-4 py-3 border text-sm placeholder:text-gray-400 outline-none transition-colors resize-y ${
                  errors.message
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:border-gray-400'
                }`}
                {...register('message')}></textarea>
              {errors.message && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary duration-300 cursor-pointer text-white py-3.5 text-[15px] font-semibold hover:bg-[#e03939] transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-2">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
