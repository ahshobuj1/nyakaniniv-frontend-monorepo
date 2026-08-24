'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useVerifyBookingOtpMutation, useResendBookingOtpMutation } from '@repo/store';

interface BookingOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  verificationToken: string;
  clientEmail: string;
  onSuccess: (booking: any) => void;
  themeColor?: string;
}

export default function BookingOtpModal({
  isOpen,
  onClose,
  verificationToken,
  clientEmail,
  onSuccess,
  themeColor = '#f63131',
}: BookingOtpModalProps) {
  const [token, setToken] = useState(verificationToken);
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes countdown
  const [canResend, setCanResend] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(30); // 30s before resend

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyBookingOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendBookingOtpMutation();

  useEffect(() => {
    setToken(verificationToken);
    setDigits(['', '', '', '', '', '']);
    setErrorMsg(null);
    setTimeLeft(600);
    setCanResend(false);
    setResendCooldown(30);
  }, [verificationToken, isOpen]);

  // Main countdown timer for OTP expiry
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, timeLeft]);

  // Resend cooldown timer
  useEffect(() => {
    if (!isOpen || canResend) return;
    if (resendCooldown <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, canResend, resendCooldown]);

  // Auto-focus first input on modal open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleDigitChange = (index: number, value: string) => {
    setErrorMsg(null);
    // Handle single character
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      setDigits(nextDigits);
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleaned[cleaned.length - 1] || '';
    setDigits(nextDigits);

    // Auto advance to next input
    if (index < 5 && cleaned.length > 0) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const nextDigits = ['', '', '', '', '', ''];
      for (let i = 0; i < pastedData.length; i++) {
        nextDigits[i] = pastedData[i] || '';
      }
      setDigits(nextDigits);
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = digits.join('');
    if (fullOtp.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit code');
      return;
    }

    setErrorMsg(null);
    try {
      const res = await verifyOtp({
        verificationToken: token,
        otp: fullOtp,
      }).unwrap();

      toast.success('Email verified & booking submitted successfully!');
      onSuccess(res.data);
      onClose();
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Invalid verification code. Please try again.';
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    setErrorMsg(null);
    try {
      const res = await resendOtp({ verificationToken: token }).unwrap();
      if (res?.data?.verificationToken) {
        setToken(res.data.verificationToken);
      }
      setDigits(['', '', '', '', '', '']);
      setTimeLeft(600);
      setCanResend(false);
      setResendCooldown(30);
      toast.success('A new 6-digit code has been sent to your email!');
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to resend code. Please try again.';
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 font-sans"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isVerifying}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>

          <div className="p-8 sm:p-10">
            {/* Header Icon */}
            <div className="flex justify-center mb-6">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: themeColor }}
              >
                <Mail size={32} />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-2">
                Verify Your Email
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                We've sent a 6-digit confirmation code to:
              </p>
              <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-800">
                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                <span className="truncate max-w-[220px]">{clientEmail}</span>
              </div>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
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
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-xl bg-slate-50 border-2 outline-none transition-all ${
                      digit
                        ? 'border-primary shadow-sm bg-white'
                        : 'border-slate-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                    }`}
                    style={digit ? { borderColor: themeColor } : {}}
                  />
                ))}
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {/* Countdown & Expiry */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Code expires in:</span>
                <span className="font-mono font-bold text-slate-700">
                  {formatTimer(timeLeft)}
                </span>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isVerifying || digits.join('').length !== 6 || timeLeft <= 0}
                className="w-full py-4 rounded-2xl text-white font-bold text-sm tracking-wide shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: themeColor }}
              >
                {isVerifying ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Verifying & Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Verify & Confirm Booking</span>
                  </>
                )}
              </button>
            </form>

            {/* Resend Option */}
            <div className="mt-6 text-center text-xs text-slate-500">
              <span>Didn't receive the email? </span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="font-bold text-primary hover:underline cursor-pointer ml-1 inline-flex items-center gap-1"
                  style={{ color: themeColor }}
                >
                  {isResending && <RefreshCw size={12} className="animate-spin" />}
                  <span>Resend Code</span>
                </button>
              ) : (
                <span className="font-medium text-slate-400 ml-1">
                  Resend in {resendCooldown}s
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
