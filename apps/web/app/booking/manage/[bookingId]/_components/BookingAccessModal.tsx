/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {useState, useRef, useEffect} from 'react';
import {
  useRequestBookingAccessOtpMutation,
  useVerifyBookingAccessOtpMutation,
  useResendBookingAccessOtpMutation,
} from '@repo/store';
import {ShieldCheck, Mail, ArrowRight, RefreshCw, Lock} from 'lucide-react';
import {toast} from 'sonner';
import type {BookingAccessModalProps} from './types';

export function BookingAccessModal({
  bookingId,
  defaultOrderReference = '',
  isOpen,
  onSuccess,
}: BookingAccessModalProps) {
  const [orderReference, setOrderReference] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedRef = sessionStorage.getItem('booking_access_ref');
      if (savedRef) return savedRef;
    }
    if (defaultOrderReference) return defaultOrderReference;
    if (
      bookingId &&
      (bookingId.startsWith('UB-') || bookingId.startsWith('ub-'))
    ) {
      return bookingId.toUpperCase();
    }
    return '';
  });

  const [email, setEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('booking_access_email') || '';
    }
    return '';
  });

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isSubmittingRef = useRef(false);

  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('booking_access_session');
    }
    return null;
  });

  const [step, setStep] = useState<'request' | 'verify'>(() => {
    if (
      typeof window !== 'undefined' &&
      sessionStorage.getItem('booking_access_session')
    ) {
      return 'verify';
    }
    return 'request';
  });

  const [requestOtp, {isLoading: isRequesting}] =
    useRequestBookingAccessOtpMutation();
  const [verifyOtp, {isLoading: isVerifying}] =
    useVerifyBookingAccessOtpMutation();
  const [resendOtp, {isLoading: isResending}] =
    useResendBookingAccessOtpMutation();

  // Auto-focus first digit box when verify step opens
  useEffect(() => {
    if (step === 'verify') {
      const timer = setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (!isOpen) return null;

  const handleResetToRequest = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('booking_access_session');
    }
    setSessionToken(null);
    setDigits(['', '', '', '', '', '']);
    setStep('request');
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }

    const next = [...digits];
    next[index] = cleaned[cleaned.length - 1] || '';
    setDigits(next);

    // Auto advance to next box
    if (index < 5 && cleaned.length > 0) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (pasted.length > 0) {
      const next = ['', '', '', '', '', ''];
      for (let i = 0; i < pasted.length; i++) {
        next[i] = pasted[i] || '';
      }
      setDigits(next);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRef = (orderReference || bookingId || '').trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanRef || !cleanEmail) {
      toast.error('Please enter both Order Reference and your Email.');
      return;
    }

    try {
      const res = await requestOtp({
        orderReference: cleanRef,
        email: cleanEmail,
      }).unwrap();

      const token = res.data?.sessionToken;
      if (token) {
        setSessionToken(token);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('booking_access_session', token);
          sessionStorage.setItem('booking_access_ref', cleanRef);
          sessionStorage.setItem('booking_access_email', cleanEmail);
        }
        setDigits(['', '', '', '', '', '']);
        setStep('verify');
        toast.success(res.message || 'Passcode sent! Check your inbox.');
      } else {
        toast.error('Failed to initiate verification.');
      }
    } catch (err: any) {
      const errMsg =
        err?.data?.error?.message ||
        err?.data?.message ||
        err?.error ||
        'Could not verify booking details. Please check your reference and email.';
      toast.error(errMsg);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmittingRef.current || isVerifying) return;

    const fullOtp = digits.join('').replace(/\D/g, '');
    if (fullOtp.length !== 6) {
      toast.error('Please enter the full 6-digit passcode.');
      return;
    }

    const currentSessionToken =
      sessionToken ||
      (typeof window !== 'undefined'
        ? sessionStorage.getItem('booking_access_session')
        : null);

    if (!currentSessionToken) {
      toast.error(
        'Access session has expired. Please request a new access code.',
      );
      handleResetToRequest();
      return;
    }

    isSubmittingRef.current = true;
    toast.dismiss();

    let verifiedAccessToken: string | null = null;

    try {
      const cleanRef = (orderReference || bookingId || '').trim().toUpperCase();
      const res = await verifyOtp({
        orderReference: cleanRef,
        otp: fullOtp,
        sessionToken: currentSessionToken,
      }).unwrap();

      const accessToken = res.data?.token || res.data?.bookingAccessToken;
      if (accessToken) {
        verifiedAccessToken = accessToken;
        toast.dismiss();
        toast.success('Access verified successfully.');
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('booking_access_token', accessToken);
          localStorage.setItem('booking_access_token', accessToken);
          sessionStorage.removeItem('booking_access_session');
        }
      } else {
        toast.error('Failed to verify passcode.');
        return;
      }
    } catch (err: any) {
      const errMsg =
        err?.data?.error?.message ||
        err?.data?.message ||
        err?.error ||
        'Incorrect or expired passcode. Please check your email or request a new code.';
      toast.error(errMsg);
      return;
    } finally {
      isSubmittingRef.current = false;
    }

    // Call onSuccess safely OUTSIDE the API catch block
    if (verifiedAccessToken) {
      try {
        onSuccess(verifiedAccessToken);
      } catch (parentErr) {
        // Log silently; the token is already stored in storage and page will re-render
        console.error('Parent onSuccess error:', parentErr);
      }
    }
  };

  const handleResend = async () => {
    const currentSessionToken =
      sessionToken ||
      (typeof window !== 'undefined'
        ? sessionStorage.getItem('booking_access_session')
        : null);

    if (!currentSessionToken) {
      toast.error('Session expired. Please request a new code.');
      handleResetToRequest();
      return;
    }

    try {
      const cleanRef = (orderReference || bookingId || '').trim().toUpperCase();
      const res = await resendOtp({
        orderReference: cleanRef,
        sessionToken: currentSessionToken,
      }).unwrap();
      if (res.data?.sessionToken) {
        setSessionToken(res.data.sessionToken);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(
            'booking_access_session',
            res.data.sessionToken,
          );
        }
      }
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      toast.success(
        res.message || 'A new passcode has been sent to your email.',
      );
    } catch (err: any) {
      const errMsg =
        err?.data?.error?.message ||
        err?.data?.message ||
        err?.error ||
        'Failed to resend passcode.';
      toast.error(errMsg);
    }
  };

  const fullOtpLength = digits.join('').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-sm shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-1">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Secure Booking Access
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            {step === 'request'
              ? 'To protect client privacy, enter your booking reference and email address to receive a secure one-time passcode.'
              : `Enter the 6-digit passcode sent to ${email || 'your email'} to view and manage this booking.`}
          </p>
        </div>

        {step === 'request' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Order Reference
              </label>
              <input
                type="text"
                value={orderReference}
                onChange={(e) =>
                  setOrderReference(e.target.value.toUpperCase())
                }
                placeholder="e.g. UB-12345678"
                className="w-full px-3 py-2 text-sm font-mono uppercase bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                required
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Found on your booking confirmation or initial email.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Client Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                  required
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isRequesting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold rounded-sm shadow-xs transition-opacity cursor-pointer">
              {isRequesting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <span>Send Access Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-center text-xs font-semibold text-gray-700 mb-3">
                Enter 6-Digit Passcode (OTP)
              </label>
              {/* 6 Digit Input Boxes */}
              <div
                className="flex justify-center gap-2 sm:gap-2.5"
                onPaste={handlePaste}>
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    disabled={isVerifying}
                    className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono rounded-md bg-gray-50 border outline-none transition-all ${
                      digit
                        ? 'border-primary shadow-xs bg-white text-gray-900 ring-1 ring-primary/20'
                        : 'border-gray-200 text-gray-800 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying || fullOtpLength < 6}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold rounded-sm shadow-xs transition-opacity cursor-pointer">
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Access Booking</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
              <button
                type="button"
                onClick={handleResetToRequest}
                className="text-gray-500 hover:text-gray-800 transition-colors cursor-pointer">
                Change Email / Ref
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer">
                {isResending ? 'Resending...' : 'Resend Code'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
