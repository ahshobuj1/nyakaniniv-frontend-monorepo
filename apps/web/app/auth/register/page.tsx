'use client';

import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {toast} from 'sonner';
import {Eye, EyeOff} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@repo/ui';
import {useRouter} from 'next/navigation';
import {useRegisterMutation} from '@repo/store';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [registerApi, {isLoading}] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const response = await registerApi(data).unwrap();
      toast.success(response.message || 'Account created successfully!');
      router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      const errorMsg = error?.data?.error?.message || error?.data?.message || 'Failed to create account.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full md:min-w-150">
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
            Create your account
          </h2>
          <p className="text-gray-500 text-[15px]">
            Start your DJ journey on UpBeat Entertainment Africa
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-lg font-semibold text-[#0F0F0F] mb-2">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Enter your first name..."
                className={`w-full px-4 py-3.5 bg-white text-sm placeholder:text-gray-400 outline-none transition-all ${
                  errors.firstName
                    ? 'border border-red-500'
                    : 'border border-transparent focus:border-gray-300 shadow-sm'
                }`}
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-lg font-semibold text-[#0F0F0F] mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Enter your last name..."
                className={`w-full px-4 py-3.5 bg-white text-sm placeholder:text-gray-400 outline-none transition-all ${
                  errors.lastName
                    ? 'border border-red-500'
                    : 'border border-transparent focus:border-gray-300 shadow-sm'
                }`}
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-lg font-semibold text-[#0F0F0F] mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="text"
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

          <div>
            <label
              htmlFor="password"
              className="block text-lg font-semibold text-[#0F0F0F] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password..."
                className={`w-full px-4 py-3.5 bg-white text-sm placeholder:text-gray-400 outline-none transition-all pr-12 ${
                  errors.password
                    ? 'border border-red-500'
                    : 'border border-transparent focus:border-gray-300 shadow-sm'
                }`}
                {...register('password')}
                suppressHydrationWarning
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={2} />
                ) : (
                  <Eye size={18} strokeWidth={2} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <Link href={'/'} className="w-1/2">
              <Button
                type="button"
                className="w-full border-2 rounded-none border-gray-700 text-gray-900 bg-transparent py-6 text-lg font-medium hover:bg-gray-100 transition-colors">
                Back
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-1/2 bg-primary rounded-none text-white py-6 border-primary text-lg font-medium hover:bg-[#e03939] border-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm">
              {isSubmitting || isLoading ? 'Processing...' : 'Continue'}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-[14px] text-gray-600">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-primary font-semibold hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
