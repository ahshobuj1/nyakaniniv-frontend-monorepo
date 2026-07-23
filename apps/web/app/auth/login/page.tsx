'use client';

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {toast} from 'sonner';
import {Eye, EyeOff} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@repo/ui';
import {useRouter} from 'next/navigation';
import {useLoginMutation} from '@repo/store';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginApi, {isLoading}] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await loginApi(data).unwrap();
      toast.success(response.message || 'Successfully logged in!');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMsg = error?.data?.error?.message || error?.data?.message || 'Failed to log in. Please check your credentials.';
      toast.error(errorMsg);
      
      if (errorMsg === 'Please verify your email before logging in') {
        router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
      }
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
            Welcome back
          </h2>
          <p className="text-gray-500 text-[15px]">Log in to your DJ account</p>
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
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="password"
                className="block text-lg font-semibold text-[#0F0F0F]">
                Password
              </label>
              <a
                href="#"
                className="text-lg font-semibold text-primary hover:underline">
                Forgot password?
              </a>
            </div>
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
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600 transition-colors">
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

          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full bg-primary text-white py-6 text-[15px] font-semibold hover:bg-[#e03939] transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-sm rounded-none">
            {isSubmitting || isLoading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div className="mt-8 text-center text-[14px] text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/register"
            className="text-primary font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
