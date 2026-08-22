'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useForgotPasswordMutation } from '@repo/store';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [forgotPasswordApi, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

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

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      const response = await forgotPasswordApi({ email: data.email }).unwrap();
      toast.success(
        response?.message || 'Password reset OTP has been sent to your email.'
      );
      router.push(`/auth/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      const errorMsg = getErrorMessage(
        error,
        'Failed to send OTP. Please try again.'
      );
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
            Forgot Password
          </h2>
          <p className="text-gray-500 text-[15px]">
            Enter your email address and we will send you a verification code to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-semibold text-[#0F0F0F] mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your registered email..."
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

          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full bg-primary text-white py-6 text-[15px] font-semibold hover:bg-[#e03939] transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-sm rounded-none">
            {isSubmitting || isLoading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>

        <div className="mt-8 text-center text-[14px] text-gray-600">
          Remember your password?{' '}
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
