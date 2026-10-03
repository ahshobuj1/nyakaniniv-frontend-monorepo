/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
  Label,
} from '@repo/ui';
import {
  useGetPaystackBanksQuery,
  useValidatePaystackAccountMutation,
  useGetPaystackOnboardingLinkMutation,
} from '@repo/store';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  PaystackBrandLogo,
  PesapalBrandLogo,
  FlutterwaveBrandLogo,
  MpesaLogo,
  AirtelMoneyLogo,
  TigoPesaLogo,
  MtnMomoLogo,
} from '@/components/payment/PaymentMethodLogos';
import {
  ConnectPayoutModalProps,
  PayoutCountry,
  PayoutGatewayOption,
  PaymentGatewayId,
} from '@/types/payment.types';

/* ─── Configuration ─────────────────────────────────────────────────── */
export const SUPPORTED_PAYOUT_COUNTRIES: PayoutCountry[] = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TZS' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: 'UGX' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: 'RWF' },
];

const GATEWAY_OPTIONS: PayoutGatewayOption[] = [
  {
    id: 'PAYSTACK',
    name: 'Paystack Bank Direct',
    headline: 'Commercial Bank Direct Deposit',
    description: 'Instant settlement directly into your local bank account.',
    recommendedFor: ['NG', 'GH', 'ZA', 'KE'],
  },
  {
    id: 'PESAPAL',
    name: 'Pesapal Mobile Money',
    headline: 'M-Pesa, Airtel Money & Tigo Pesa',
    description: 'Direct mobile wallet settlements across East Africa.',
    recommendedFor: ['KE', 'TZ', 'UG', 'RW'],
  },
  {
    id: 'FLUTTERWAVE',
    name: 'Flutterwave Universal',
    headline: 'Pan-African Multi-Currency',
    description: 'Universal settlement across bank accounts and mobile wallets.',
    recommendedFor: ['NG', 'GH', 'KE', 'ZA', 'TZ', 'UG', 'RW'],
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════════════ */
export default function ConnectPayoutModal({
  isOpen,
  onClose,
  tenantId,
  defaultCountry = 'kenya',
  defaultStageName = '',
  isConnected = false,
  onDisconnect,
  onSuccess,
}: ConnectPayoutModalProps) {
  /* ─── Country Selection State ────────────────────────────────────── */
  const initialCountry =
    SUPPORTED_PAYOUT_COUNTRIES.find(
      (c) =>
        c.name.toLowerCase() === defaultCountry.toLowerCase().trim() ||
        c.code.toLowerCase() === defaultCountry.toLowerCase().trim()
    ) || SUPPORTED_PAYOUT_COUNTRIES[1];

  const [selectedCountry, setSelectedCountry] = useState<PayoutCountry>(initialCountry);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayId>('PAYSTACK');

  /* ─── Account inputs ─────────────────────────────────────────────── */
  const [bankCode, setBankCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankSearch, setBankSearch] = useState('');

  /* ─── Verification state ─────────────────────────────────────────── */
  const [isValidated, setIsValidated] = useState(false);
  const [verifiedAccountName, setVerifiedAccountName] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  /* ─── RTK Query ──────────────────────────────────────────────────── */
  const { data: banksResponse, isLoading: isLoadingBanks } = useGetPaystackBanksQuery(
    { country: selectedCountry.code, gateway: selectedGateway },
    { skip: !isOpen }
  );
  const banksList = banksResponse?.data || [];

  const [validateAccount, { isLoading: isValidating }] = useValidatePaystackAccountMutation();
  const [onboardAccount, { isLoading: isOnboarding }] = useGetPaystackOnboardingLinkMutation();

  /* ─── Handlers ───────────────────────────────────────────────────── */
  const resetVerification = () => {
    setIsValidated(false);
    setVerifiedAccountName(null);
    setValidationError(null);
  };

  const handleCountryChange = (c: PayoutCountry) => {
    setSelectedCountry(c);
    setBankCode('');
    setBankName('');
    setAccountNumber('');
    resetVerification();
  };

  const handleGatewayChange = (gw: PaymentGatewayId) => {
    setSelectedGateway(gw);
    setBankCode('');
    setBankName('');
    setAccountNumber('');
    resetVerification();
  };

  const handleBankChange = (code: string) => {
    setBankCode(code);
    const found = banksList.find((b: any) => String(b.code || b.id) === String(code));
    setBankName(found?.name || code);
    resetVerification();
  };

  const handleAccountChange = (val: string) => {
    setAccountNumber(val);
    resetVerification();
  };

  const filteredBanks = banksList.filter((b: any) =>
    (b.name || '').toLowerCase().includes(bankSearch.toLowerCase())
  );

  /* ─── Verify Account ─────────────────────────────────────────────── */
  const handleVerifyAccount = async () => {
    resetVerification();

    const cleanAccount = accountNumber.trim();
    if (!cleanAccount) {
      setValidationError(
        selectedGateway === 'PESAPAL'
          ? 'Please enter your mobile money phone number.'
          : 'Please enter your bank account number.'
      );
      return;
    }

    if (selectedGateway !== 'PESAPAL' && !bankCode) {
      setValidationError('Please select your bank first.');
      return;
    }

    try {
      const res: any = await validateAccount({
        bankCode: bankCode || 'MOBILE_MONEY',
        accountNumber: cleanAccount,
        country: selectedCountry.code,
        gateway: selectedGateway,
      }).unwrap();

      const valData = res?.data || res;
      if (valData?.valid) {
        setIsValidated(true);
        setVerifiedAccountName(valData.accountName || defaultStageName || 'Verified Account Holder');
        toast.success(`Account verified: ${valData.accountName || 'Active account'}`);
      } else {
        setValidationError(
          valData?.message || 'Could not verify account details. Please check your account number.'
        );
      }
    } catch (err: any) {
      setValidationError(
        err?.data?.error?.message ||
          err?.data?.message ||
          err?.message ||
          'Verification failed. Please check your details.'
      );
    }
  };

  /* ─── Submit ─────────────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidated) {
      setValidationError('Please verify your account before saving.');
      return;
    }

    try {
      const payload = {
        tenantId,
        bankCode: bankCode || 'MOBILE_MONEY',
        bankName: bankName || (selectedGateway === 'PESAPAL' ? 'Mobile Money Wallet' : bankCode),
        accountNumber: accountNumber.trim(),
        accountName: verifiedAccountName || defaultStageName || 'DJ Account',
        businessName: verifiedAccountName || defaultStageName || 'DJ Account',
        country: selectedCountry.code,
        gateway: selectedGateway,
      };

      await onboardAccount(payload).unwrap();
      toast.success('Payout destination connected!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || err?.message || 'Failed to save payout account.');
    }
  };

  /* ─── Gateway Brand Render ───────────────────────────────────────── */
  const renderGatewayBrand = (id: PaymentGatewayId) => {
    switch (id) {
      case 'PAYSTACK': return <PaystackBrandLogo />;
      case 'PESAPAL': return <PesapalBrandLogo />;
      case 'FLUTTERWAVE': return <FlutterwaveBrandLogo />;
      default: return null;
    }
  };

  /* ─── Section Label ──────────────────────────────────────────────── */
  const SectionLabel = ({ step, children }: { step: number; children: React.ReactNode }) => (
    <div className="flex items-center gap-2 mb-2">
      <span className="flex items-center justify-center w-5 h-5 rounded-sm bg-gray-900 text-white text-[10px] font-bold leading-none">
        {step}
      </span>
      <Label className="text-[11.5px] font-semibold text-gray-700 tracking-wide uppercase">
        {children}
      </Label>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl w-full p-0 bg-white rounded-sm shadow-2xl border border-gray-200 max-h-[92vh] overflow-y-auto">
        {/* ─── Header ────────────────────────────────────────── */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-[17px] font-bold text-gray-900 tracking-[-0.01em]">
              Connect Payout Account
            </DialogTitle>
            <DialogDescription className="text-[13px] text-gray-500 leading-relaxed">
              Link a verified bank account or mobile wallet to receive your earnings.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6 pt-5">

          {/* ─── 1. Settlement Network ──────────────────────── */}
          <div>
            <SectionLabel step={1}>Settlement Network</SectionLabel>
            <div className="space-y-1.5">
              {GATEWAY_OPTIONS.map((gw) => {
                const isSelected = selectedGateway === gw.id;
                return (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => handleGatewayChange(gw.id)}
                    className={`relative w-full flex items-center gap-3 p-3 rounded-sm border text-left transition-all duration-150 cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'border-primary/40 bg-primary/[0.03]'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    {/* Selected accent bar */}
                    {isSelected && (
                      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-full" />
                    )}
                    <div className="shrink-0">
                      {renderGatewayBrand(gw.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-gray-500 leading-none">
                        {gw.headline}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── 2. Settlement Country ──────────────────────── */}
          <div>
            <SectionLabel step={2}>Settlement Country</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {SUPPORTED_PAYOUT_COUNTRIES.map((c) => {
                const isSelected = selectedCountry.code === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountryChange(c)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-sm border text-xs font-medium transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'border-primary/40 bg-primary/[0.04] text-primary'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <span className="text-sm leading-none">{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                    <span className="text-[9px] text-gray-400 ml-auto uppercase font-mono tracking-tight">
                      {c.currency}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── 3. Bank / Mobile Money ─────────────────────── */}
          {selectedGateway !== 'PESAPAL' ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-sm bg-gray-900 text-white text-[10px] font-bold leading-none">
                    3
                  </span>
                  <Label className="text-[11.5px] font-semibold text-gray-700 tracking-wide uppercase">
                    Select Bank
                  </Label>
                </div>
                {isLoadingBanks && (
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Loading…
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Search bank…"
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  className="text-xs h-9 border-gray-200 rounded-sm bg-gray-50/50 focus:bg-white"
                />
                <select
                  value={bankCode}
                  onChange={(e) => handleBankChange(e.target.value)}
                  disabled={isLoadingBanks}
                  className="w-full h-10 px-3 text-sm rounded-sm border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 text-gray-900 transition-all"
                >
                  <option value="">— Choose your bank ({filteredBanks.length} available) —</option>
                  {filteredBanks.map((b: any, idx: number) => (
                    <option key={`${b.id || b.code || 'bank'}-${idx}`} value={b.code || b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div>
              <SectionLabel step={3}>Mobile Money Provider</SectionLabel>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { code: 'MPESA', name: 'M-Pesa', renderLogo: () => <MpesaLogo size="xs" /> },
                  { code: 'AIRTEL', name: 'Airtel Money', renderLogo: () => <AirtelMoneyLogo size="xs" /> },
                  { code: 'TIGO', name: 'Tigo Pesa', renderLogo: () => <TigoPesaLogo size="xs" /> },
                  { code: 'MTN', name: 'MTN MoMo', renderLogo: () => <MtnMomoLogo size="xs" /> },
                ].map((net) => {
                  const isSelected = bankCode === net.code;
                  return (
                    <button
                      key={net.code}
                      type="button"
                      onClick={() => handleBankChange(net.code)}
                      className={`relative flex items-center gap-2 p-3 rounded-sm border text-xs font-medium transition-all duration-150 cursor-pointer overflow-hidden ${
                        isSelected
                          ? 'border-primary/40 bg-primary/[0.04] text-primary'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary rounded-r-full" />
                      )}
                      {net.renderLogo()}
                      <span className="truncate">{net.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── 4. Account Number & Verification ───────────── */}
          <div>
            <SectionLabel step={4}>
              {selectedGateway === 'PESAPAL' ? 'Phone Number' : 'Account Number'}
            </SectionLabel>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={selectedGateway === 'PESAPAL' ? 'e.g. 0712345678' : 'e.g. 0123456789'}
                value={accountNumber}
                onChange={(e) => handleAccountChange(e.target.value)}
                className="h-10 rounded-sm text-sm border-gray-200 bg-gray-50/50 focus:bg-white"
              />
              <Button
                type="button"
                onClick={handleVerifyAccount}
                disabled={isValidating || !accountNumber.trim()}
                className="h-10 px-4 rounded-sm bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium shrink-0 transition-all duration-150 cursor-pointer"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Checking…
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    Verify
                  </>
                )}
              </Button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">
              We verify your details directly with the banking network before saving.
            </p>
          </div>

          {/* ─── Verification Success ───────────────────────── */}
          {isValidated && verifiedAccountName && (
            <div className="relative overflow-hidden rounded-sm border border-emerald-200 bg-emerald-50/60 animate-in fade-in slide-in-from-top-1 duration-200">
              <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-500" />
              <div className="px-4 py-3 pl-5 space-y-2">
                <div className="flex items-start gap-2.5 text-emerald-800">
                  <CheckCircle2 className="w-[18px] h-[18px] text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                      Account Verified
                    </div>
                    <div className="text-sm font-bold text-emerald-950">
                      {verifiedAccountName}
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      {bankName || 'Settlement Account'} •••• {accountNumber.slice(-4)}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-emerald-700/80 border-t border-emerald-200/60 pt-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Payouts will be sent to this verified account.</span>
                </div>
              </div>
            </div>
          )}

          {/* ─── Validation Error ───────────────────────────── */}
          {validationError && (
            <div className="relative overflow-hidden rounded-sm border border-red-200 bg-red-50/60 animate-in fade-in duration-200">
              <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-red-500" />
              <div className="flex items-start gap-2 px-4 py-3 pl-5 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <div>
                  <span className="font-bold">Failed: </span>
                  <span>{validationError}</span>
                </div>
              </div>
            </div>
          )}

          {/* ─── Actions ────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
            {isConnected && onDisconnect ? (
              <button
                type="button"
                onClick={() => { onClose(); onDisconnect(); }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer py-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isOnboarding}
                className="h-9 px-4 rounded-sm text-sm font-medium border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all duration-150"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValidated || isOnboarding}
                className={`h-9 px-5 rounded-sm text-sm font-semibold transition-all duration-150 ${
                  isValidated
                    ? 'bg-primary hover:bg-primary/90 text-white cursor-pointer shadow-sm'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                }`}
              >
                {isOnboarding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…
                  </>
                ) : (
                  'Save Destination'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
