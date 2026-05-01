'use client';

import React, {useState, useRef, KeyboardEvent, ClipboardEvent} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {toast} from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@repo/ui';

const verifySchema = z.object({
  code: z
    .string()
    .length(6, 'Please enter all 6 digits of the verification code'),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export default function VerificationPage() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {code: ''},
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const joinedOtp = newOtp.join('');
    setValue('code', joinedOtp, {shouldValidate: true});

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (
      e.key === 'Backspace' &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 8).split('');
    if (pastedData.some((char) => isNaN(Number(char)))) return;

    const newOtp = [...otp];
    pastedData.forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    setValue('code', newOtp.join(''), {shouldValidate: true});

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const onSubmit = async (data: VerifyFormValues) => {
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Verification successful!');
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
          <h2 className="text-[32px] font-semibold text-gray-900 mb-2 tracking-tight">
            Enter Verification Code
          </h2>
          <p className="text-gray-500 text-[15px]">
            Please enter the verification code sent to your email.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col items-center">
          <div className="flex justify-center gap-2 sm:gap-3 w-full">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-center text-xl font-semibold text-gray-900 outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
              />
            ))}
          </div>

          {errors.code && (
            <p className="text-red-500 text-xs text-center">
              {errors.code.message}
            </p>
          )}

          <div className="w-full px-2 sm:px-0">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary rounded-none text-white py-6 text-[15px] font-semibold hover:bg-[#e03939] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm">
              {isSubmitting ? 'Verifying...' : 'Submit'}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-primary duration-300 cursor-pointer text-[14px] font-semibold hover:underline">
            Resend It
          </button>
        </div>
      </div>
    </div>
  );
}
