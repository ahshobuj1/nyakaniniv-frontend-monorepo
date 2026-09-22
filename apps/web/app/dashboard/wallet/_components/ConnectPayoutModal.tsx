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
  BankTransferLogo,
} from '@/components/payment/PaymentMethodLogos';
import {
  ConnectPayoutModalProps,
  PayoutCountry,
  PayoutGatewayOption,
  PaymentGatewayId,
} from '@/types/payment.types';

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
    description: 'Instant settlement directly into your local Nigerian, Kenyan, Ghanaian, or South African bank account.',
    recommendedFor: ['NG', 'GH', 'ZA', 'KE'],
  },
  {
    id: 'PESAPAL',
    name: 'Pesapal Mobile Money',
    headline: 'M-Pesa, Airtel Money & Tigo Pesa',
    description: 'Direct mobile wallet settlements across East Africa (Kenya, Tanzania, Uganda, Rwanda).',
    recommendedFor: ['KE', 'TZ', 'UG', 'RW'],
  },
  {
    id: 'FLUTTERWAVE',
    name: 'Flutterwave Universal',
    headline: 'Pan-African Multi-Currency',
    description: 'Universal settlement across bank accounts and mobile wallets across 15+ African regions.',
    recommendedFor: ['NG', 'GH', 'KE', 'ZA', 'TZ', 'UG', 'RW'],
  },
];

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
  // 1. Country Selection State
  const initialCountry =
    SUPPORTED_PAYOUT_COUNTRIES.find(
      (c) =>
        c.name.toLowerCase() === defaultCountry.toLowerCase().trim() ||
        c.code.toLowerCase() === defaultCountry.toLowerCase().trim()
    ) || SUPPORTED_PAYOUT_COUNTRIES[1]; // default Kenya

  const [selectedCountry, setSelectedCountry] = useState<PayoutCountry>(initialCountry);

  // 2. Gateway Selection State (DJ has complete autonomy)
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayId>('PAYSTACK');

  // 3. Account inputs
  const [bankCode, setBankCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankSearch, setBankSearch] = useState('');

  // 4. Verification state (Guarantees account really exists)
  const [isValidated, setIsValidated] = useState(false);
  const [verifiedAccountName, setVerifiedAccountName] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // RTK Query Hooks
  const { data: banksResponse, isLoading: isLoadingBanks } = useGetPaystackBanksQuery(
    { country: selectedCountry.code, gateway: selectedGateway },
    { skip: !isOpen }
  );
  const banksList = banksResponse?.data || [];

  const [validateAccount, { isLoading: isValidating }] = useValidatePaystackAccountMutation();
  const [onboardAccount, { isLoading: isOnboarding }] = useGetPaystackOnboardingLinkMutation();

  // Reset verification whenever key fields change
  const handleCountryChange = (c: PayoutCountry) => {
    setSelectedCountry(c);
    setBankCode('');
    setBankName('');
    setAccountNumber('');
    setIsValidated(false);
    setVerifiedAccountName(null);
    setValidationError(null);
  };

  const handleGatewayChange = (gw: PaymentGatewayId) => {
    setSelectedGateway(gw);
    setBankCode('');
    setBankName('');
    setAccountNumber('');
    setIsValidated(false);
    setVerifiedAccountName(null);
    setValidationError(null);
  };

  const handleBankChange = (code: string) => {
    setBankCode(code);
    const found = banksList.find((b: any) => String(b.code || b.id) === String(code));
    setBankName(found?.name || code);
    setIsValidated(false);
    setVerifiedAccountName(null);
    setValidationError(null);
  };

  const handleAccountChange = (val: string) => {
    setAccountNumber(val);
    setIsValidated(false);
    setVerifiedAccountName(null);
    setValidationError(null);
  };

  // Filter banks
  const filteredBanks = banksList.filter((b: any) =>
    (b.name || '').toLowerCase().includes(bankSearch.toLowerCase())
  );

  // Real-time interbank / network verification
  const handleVerifyAccount = async () => {
    setValidationError(null);
    setIsValidated(false);
    setVerifiedAccountName(null);

    const cleanAccount = accountNumber.trim();
    if (!cleanAccount) {
      setValidationError(
        selectedGateway === 'PESAPAL'
          ? 'Please enter your mobile money phone number (e.g. 0712345678).'
          : 'Please enter your bank account number.'
      );
      return;
    }

    if (selectedGateway !== 'PESAPAL' && !bankCode) {
      setValidationError('Please select your settlement bank from the list.');
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
          valData?.message ||
            'Could not verify account details with the banking network. Please verify your account number.'
        );
      }
    } catch (err: any) {
      setValidationError(
        err?.data?.error?.message ||
          err?.data?.message ||
          err?.message ||
          'Verification failed. Please check your bank and account number.'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidated) {
      setValidationError('Please verify your account details before saving to ensure payouts succeed.');
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
      toast.success('Payout destination connected successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || err?.message || 'Failed to save payout account.');
    }
  };

  const renderGatewayBrand = (id: PaymentGatewayId) => {
    switch (id) {
      case 'PAYSTACK':
        return <PaystackBrandLogo />;
      case 'PESAPAL':
        return <PesapalBrandLogo />;
      case 'FLUTTERWAVE':
        return <FlutterwaveBrandLogo />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl w-full p-6 sm:p-7 bg-white rounded-3xl shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
        <DialogHeader className="space-y-1.5 text-left border-b border-gray-100/50 pb-5">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Connect Payout Account
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Link a verified bank account or mobile wallet to receive automated booking settlements.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-3">
          {/* 1. Choose Payout Provider / Gateway (DJ Choice) */}
          <div className="space-y-2.5">
            <Label className="text-sm font-semibold text-gray-900">
              1. Settlement Network
            </Label>

            <div className="grid grid-cols-1 gap-2.5">
              {GATEWAY_OPTIONS.map((gw) => {
                const isSelected = selectedGateway === gw.id;
                return (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => handleGatewayChange(gw.id)}
                    className={`flex flex-col text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/[0.04] text-primary shadow-xs ring-2 ring-primary/20'
                        : 'border-[#E5E7EB] bg-white text-[#111620] hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {renderGatewayBrand(gw.id)}
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 ml-1" />
                      ) : null}
                    </div>
                    <span className="text-[11px] text-[#787878] mt-1 line-clamp-2 leading-normal">
                      {gw.headline}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Select Country */}
          <div className="space-y-2.5 pt-1">
            <Label className="text-sm font-semibold text-gray-900">
              2. Settlement Country
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SUPPORTED_PAYOUT_COUNTRIES.map((c) => {
                const isSelected = selectedCountry.code === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCountryChange(c)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary'
                        : 'border-[#E5E7EB] bg-white text-[#111620] hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-base">{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                    <span className="text-[10px] text-[#787878] ml-auto uppercase font-mono">
                      {c.currency}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Bank / Mobile Money Provider Selection */}
          {selectedGateway !== 'PESAPAL' ? (
            <div className="space-y-2.5 pt-1">
              <Label className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                <span>3. Select Bank</span>
                {isLoadingBanks && (
                  <span className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading...
                  </span>
                )}
              </Label>

              <div className="space-y-1.5">
                <Input
                  type="text"
                  placeholder="Filter bank name..."
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  className="text-xs h-8 border-[#E5E7EB]"
                />

                <select
                  value={bankCode}
                  onChange={(e) => handleBankChange(e.target.value)}
                  disabled={isLoadingBanks}
                  className="w-full h-11 px-3 text-sm rounded-xl border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-[#111620]"
                >
                  <option value="">-- Choose your bank ({filteredBanks.length} available) --</option>
                  {filteredBanks.map((b: any, idx: number) => (
                    <option key={`${b.id || b.code || 'bank'}-${idx}`} value={b.code || b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 pt-1">
              <Label className="text-sm font-semibold text-gray-900">
                3. Mobile Money Provider
              </Label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    code: 'MPESA',
                    name: 'M-Pesa (Safaricom / Vodacom)',
                    renderLogo: () => <MpesaLogo size="xs" />,
                  },
                  {
                    code: 'AIRTEL',
                    name: 'Airtel Money',
                    renderLogo: () => <AirtelMoneyLogo size="xs" />,
                  },
                  {
                    code: 'TIGO',
                    name: 'Tigo Pesa',
                    renderLogo: () => <TigoPesaLogo size="xs" />,
                  },
                  {
                    code: 'MTN',
                    name: 'MTN Mobile Money',
                    renderLogo: () => <MtnMomoLogo size="xs" />,
                  },
                ].map((net) => {
                  const isSelected = bankCode === net.code;
                  return (
                    <button
                      key={net.code}
                      type="button"
                      onClick={() => handleBankChange(net.code)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary/5 text-primary shadow-xs ring-1 ring-primary'
                          : 'border-[#E5E7EB] bg-white text-[#111620] hover:bg-gray-50'
                      }`}
                    >
                      {net.renderLogo()}
                      <span className="truncate">{net.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Account Number & Real Interbank Verification */}
          <div className="space-y-2.5 pt-1">
            <Label className="text-sm font-semibold text-gray-900">
              {selectedGateway === 'PESAPAL' ? '4. Phone Number' : '4. Account Number'}
            </Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={selectedGateway === 'PESAPAL' ? 'e.g. 0712345678' : 'e.g. 0123456789'}
                value={accountNumber}
                onChange={(e) => handleAccountChange(e.target.value)}
                className="h-11 rounded-xl text-sm border-[#E5E7EB]"
              />
              <Button
                type="button"
                onClick={handleVerifyAccount}
                disabled={isValidating || !accountNumber.trim()}
                className="h-11 px-5 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-medium shrink-0 transition-all cursor-pointer"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    Verify Details
                  </>
                )}
              </Button>
            </div>
            <p className="text-[11px] text-[#787878]">
              We query the banking network directly to guarantee your payout details exist before saving.
            </p>
          </div>

          {/* Verification Status Card */}
          {isValidated && verifiedAccountName && (
            <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl space-y-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start gap-2.5 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Official Account Verified
                  </div>
                  <div className="text-sm font-extrabold text-emerald-950">
                    {verifiedAccountName}
                  </div>
                  <div className="text-xs text-emerald-700 font-medium">
                    {bankName || 'Settlement Account'} •••• {accountNumber.slice(-4)}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-emerald-700/90 border-t border-emerald-200/60 pt-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Withdrawals will be transferred directly to this verified account holder.</span>
              </div>
            </div>
          )}

          {/* Validation Error Alert */}
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <span className="font-bold">Verification Failed: </span>
                <span>{validationError}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
            {isConnected && onDisconnect ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDisconnect();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer py-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Account</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isOnboarding}
                className="h-11 px-5 rounded-xl text-xs font-semibold border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValidated || isOnboarding}
                className={`h-11 px-6 rounded-xl text-xs font-bold shadow-md transition-all ${
                  isValidated
                    ? 'bg-primary hover:bg-[#d62828] text-white shadow-primary/25 cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isOnboarding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Destination...
                  </>
                ) : (
                  'Save Verified Destination'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
