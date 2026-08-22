'use client';

import { useState, Suspense, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@repo/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useResetPasswordMutation, useResendOtpMutation } from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';

const resetPasswordSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    otp: z.string().min(1, 'Verification code is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const initialOtp = searchParams.get('otp') || '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetPasswordApi, { isLoading: isResetting }] = useResetPasswordMutation();
  const [resendOtpApi, { isLoading: isResending }] = useResendOtpMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: initialEmail,
      otp: initialOtp,
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (initialEmail) setValue('email', initialEmail);
    if (initialOtp) setValue('otp', initialOtp);
  }, [initialEmail, initialOtp, setValue]);

  const currentEmail = watch('email');

  const getErrorMessage = (error: any, defaultMsg: string) => {
    const issues = error?.data?.error?.details?.issues;
    if (Array.isArray(issues) && issues.length > 0) {
      return issues.map((i: any) => i.message).join(', ');
    }
    return (
      error?.data?.error?.message ||
      error?.data?.message ||
      defaultMsg
    );
  };

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      const response = await resetPasswordApi({
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success(
        response?.message || 'Password has been reset successfully! Please log in.'
      );
      router.push('/auth/login');
    } catch (error: any) {
      const errorMsg = getErrorMessage(
        error,
        'Failed to reset password. Please check your OTP and try again.'
      );
      toast.error(errorMsg);
    }
  };

  const handleResendOtp = async () => {
    if (!currentEmail) {
      toast.error('Please enter your email address to resend OTP.');
      return;
    }
    try {
      const response = await resendOtpApi({ email: currentEmail }).unwrap();
      toast.success(response?.message || 'New OTP has been sent to your email!');
    } catch (error: any) {
      const errorMsg = getErrorMessage(error, 'Failed to resend OTP.');
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full md:max-w-150 mx-auto">
        <div className="flex flex-col items-center mb-6">
          <Link className="rounded-md p-2 hover:bg-muted/50 py-4" href="/">
            <Image
              src={'/auth.logo.png'}
              width={500}
              height={500}
              alt="logo"
              className="max-w-30 bg-contain w-auto h-auto"
              priority
            />
          </Link>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-[32px] font-bold text-gray-900 mb-2">
            Reset Password
          </h2>
          <p className="text-gray-500 text-[15px]">
            Enter your email, the OTP sent to your inbox, and your new password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-semibold text-[#0F0F0F] mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email..."
              className={`w-full px-4 py-3.5 bg-white text-sm placeholder:text-gray-400 outline-none transition-all ${
                errors.email
                  ? 'border border-red-500'
                  : 'border border-transparent focus:border-gray-300 shadow-sm'
              }`}
              {...register('email')}
              suppressHydrationWarning
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* OTP */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="otp"
                className="block text-lg font-semibold text-[#0F0F0F]">
                Verification Code (OTP)
              </label>
              
            </div>
            <input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP..."
              className={`w-full px-4 py-3.5 bg-white text-sm placeholder:text-gray-400 outline-none transition-all ${
                errors.otp
                  ? 'border border-red-500'
                  : 'border border-transparent focus:border-gray-300 shadow-sm'
              }`}
              {...register('otp')}
              suppressHydrationWarning
            />
            {errors.otp && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.otp.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-lg font-semibold text-[#0F0F0F] mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password..."
                className={`w-full px-4 py-3.5 bg-white text-sm placeholder:text-gray-400 outline-none transition-all pr-12 ${
                  errors.newPassword
                    ? 'border border-red-500'
                    : 'border border-transparent focus:border-gray-300 shadow-sm'
                }`}
                {...register('newPassword')}
                suppressHydrationWarning
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600 transition-colors">
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={2} />
                ) : (
                  <Eye size={18} strokeWidth={2} />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-lg font-semibold text-[#0F0F0F] mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password..."
                className={`w-full px-4 py-3.5 bg-white text-sm placeholder:text-gray-400 outline-none transition-all pr-12 ${
                  errors.confirmPassword
                    ? 'border border-red-500'
                    : 'border border-transparent focus:border-gray-300 shadow-sm'
                }`}
                {...register('confirmPassword')}
                suppressHydrationWarning
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600 transition-colors">
                {showConfirmPassword ? (
                  <EyeOff size={18} strokeWidth={2} />
                ) : (
                  <Eye size={18} strokeWidth={2} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isResetting}
            className="w-full bg-primary text-white py-6 text-[15px] font-semibold hover:bg-[#e03939] transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-sm rounded-none">
            {isSubmitting || isResetting ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </form>

        <div className="mt-8 text-center text-[14px] text-gray-600">
          Already know your password?{' '}
          <Link
            href="/auth/login"
            className="text-primary font-semibold hover:underline">
            Back to Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
