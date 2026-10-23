'use client';

import React, {useState} from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Info,
} from 'lucide-react';
import {Button} from '@repo/ui';
import {
  PaystackBrandLogo,
  PesapalBrandLogo,
  FlutterwaveBrandLogo,
  PaymentMethodBadge,
} from '@/components/payment/PaymentMethodLogos';
import {
  GatewaySelectionModalProps,
  GatewayCardOption,
} from '@/types/payment.types';

export default function GatewaySelectionModal({
  isOpen,
  onClose,
  onSelectGateway,
  planName = 'DJ Pro Plan',
  price,
  billingCycle = 'monthly',
  currency = 'KES',
  tenantCountry = '',
  isLoading = false,
  isUpgrade = false,
  currentPlanName,
  remainingDays,
  unusedCredit = 0,
  amountToPay,
  isDowngrade = false,
  downgradeMessage = null,
  onInstantUpgrade,
}: GatewaySelectionModalProps) {
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const normalizedCountry = (tenantCountry || '').trim().toLowerCase();
  const isEastAfrica = [
    'tanzania',
    'tz',
    'kenya',
    'ke',
    'uganda',
    'ug',
    'rwanda',
    'rw',
  ].includes(normalizedCountry);

  const defaultGateway = 'paystack';
  const [userSelectedGateway, setUserSelectedGateway] = useState<string | null>(
    null,
  );
  const selectedGateway = userSelectedGateway || defaultGateway;

  if (!isOpen) return null;

  const finalPayable = amountToPay !== undefined ? amountToPay : price || 0;
  const isInstantUpgrade = isUpgrade && finalPayable === 0 && !isDowngrade;

  const gateways: GatewayCardOption[] = [
    {
      id: 'paystack',
      name: 'Paystack',
      title: 'Paystack Direct Checkout',
      description:
        'Instant card payments, direct bank transfer, Apple Pay & Verve debit',
      badge: 'Recommended Gateway',
      currencies: ['KES', 'NGN', 'GHS', 'ZAR', 'USD'],
      isRecommended: true,
      paymentMethods: [
        'Visa',
        'Mastercard',
        'Bank Transfer',
        'Apple Pay',
        'Verve',
      ],
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      title: 'Flutterwave Pan-African',
      description:
        'Pan-African payments across 15+ currencies with local cards and bank wires',
      badge: 'Pan-African Multi-Currency',
      currencies: ['KES', 'NGN', 'GHS', 'ZAR', 'USD', 'TZS', 'UGX', 'RWF'],
      isRecommended: false,
      paymentMethods: ['Visa', 'Mastercard', 'Mobile Money', 'Bank Wire'],
    },
    {
      id: 'pesapal',
      name: 'Pesapal',
      title: 'Pesapal Mobile Money & Cards',
      description:
        'Instant local checkout via M-Pesa, Tigo Pesa, Airtel Money & Visa/Mastercard',
      badge: isEastAfrica
        ? 'East Africa Local Checkout'
        : 'East Africa Mobile Money',
      currencies: ['TZS', 'KES', 'UGX', 'USD'],
      isRecommended: false,
      paymentMethods: [
        'M-Pesa',
        'Tigo Pesa',
        'Airtel Money',
        'Visa',
        'Mastercard',
      ],
    },
  ];

  const handleProceed = async () => {
    if (isDowngrade) return;

    if (!acceptedTerms) {
      setValidationError(
        'Please agree to the Terms of Service and acknowledge the Non-Refundable Policy to proceed.',
      );
      return;
    }

    setValidationError(null);

    if (isInstantUpgrade && onInstantUpgrade) {
      await onInstantUpgrade();
      return;
    }
    await onSelectGateway(selectedGateway);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptedTerms(e.target.checked);
    if (e.target.checked) {
      setValidationError(null);
    }
  };

  const renderGatewayLogo = (id: string) => {
    switch (id) {
      case 'paystack':
        return <PaystackBrandLogo />;
      case 'pesapal':
        return <PesapalBrandLogo />;
      case 'flutterwave':
        return <FlutterwaveBrandLogo />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-sm bg-white border border-gray-200 p-6 sm:p-8 text-[#111620] shadow-2xl overflow-hidden transition-all max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="relative flex items-start justify-between pb-5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-[11px] font-bold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-3 h-3 text-primary" />
                {isUpgrade
                  ? 'Plan Upgrade Confirmation'
                  : 'Subscription Confirmation'}
              </span>
              {tenantCountry ? (
                <span className="text-[11px] text-gray-500 uppercase font-medium tracking-wider">
                  • {tenantCountry}
                </span>
              ) : null}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111620]">
              {isUpgrade ? 'Confirm Plan Upgrade' : 'Select Payment Method'}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              {isUpgrade
                ? 'Review your prorated upgrade breakdown and confirm agreement to proceed.'
                : 'Select your preferred gateway and confirm agreement to activate your subscription.'}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-sm p-2 text-gray-400 hover:text-[#111620] hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Downgrade Protection Alert */}
        {isDowngrade ? (
          <div className="mt-5 p-4 rounded-sm bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-[13px]">Downgrade Notice</p>
              <p className="text-amber-800 leading-relaxed">
                {downgradeMessage ||
                  'Mid-cycle downgrades are not supported. Your current plan remains fully active until period end.'}
              </p>
            </div>
          </div>
        ) : null}

        {/* Plan & Pricing Breakdown */}
        <div className="mt-5 p-4 rounded-sm bg-gray-50 border border-gray-100 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
            <div>
              <p className="text-xs text-gray-500 font-medium">Target Plan</p>
              <p className="text-sm font-bold text-[#111620]">{planName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium capitalize">
                {billingCycle} Billing
              </p>
              <p className="text-sm font-bold text-gray-700 font-mono">
                {currency} {(price || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Proration Breakdown if Upgrading */}
          {isUpgrade && unusedCredit > 0 && !isDowngrade && (
            <div className="space-y-1.5 text-xs">
              {currentPlanName && (
                <div className="flex justify-between text-gray-500">
                  <span>Current Plan:</span>
                  <span className="font-medium text-gray-700">
                    {currentPlanName}{' '}
                    {remainingDays ? `(${remainingDays} days remaining)` : ''}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>New Plan Base Price:</span>
                <span className="font-medium font-mono">
                  {currency} {(price || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  Prorated Balance Credit Applied:
                </span>
                <span className="font-mono">
                  - {currency} {unusedCredit.toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                <span className="font-bold text-gray-900 text-sm">
                  Net Amount Payable Today:
                </span>
                <span className="font-black text-primary font-mono text-base">
                  {currency} {finalPayable.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {!isUpgrade && price !== undefined && (
            <div className="flex justify-between items-baseline pt-1">
              <span className="font-bold text-gray-900 text-xs">
                Total Payable Today:
              </span>
              <span className="font-black text-primary font-mono text-base">
                {currency} {price.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Instant Upgrade Notification if 100% covered by credit */}
        {isInstantUpgrade ? (
          <div className="mt-5 p-4 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-[13px]">
                100% Covered by Current Balance!
              </p>
              <p className="text-emerald-800 leading-relaxed">
                Your remaining credit covers this upgrade completely. No gateway
                charge is required today.
              </p>
            </div>
          </div>
        ) : null}

        {/* Gateway Selection Cards (Hidden if Downgrade or Instant Upgrade) */}
        {!isDowngrade && !isInstantUpgrade && (
          <div className="mt-5 space-y-3">
            <p className="text-xs font-semibold text-gray-700">
              Select Payment Gateway:
            </p>
            {gateways.map((gw) => {
              const isSelected = selectedGateway === gw.id;
              return (
                <div
                  key={gw.id}
                  onClick={() => !isLoading && setUserSelectedGateway(gw.id)}
                  className={`relative rounded-sm p-4 border cursor-pointer transition-all duration-200 select-none ${
                    isSelected
                      ? 'border-primary bg-primary/[0.04] ring-1 ring-primary shadow-xs'
                      : 'bg-white border-gray-200 hover:bg-gray-50/70 hover:border-gray-300'
                  }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      {/* Gateway Header with Logo & Badges */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          {renderGatewayLogo(gw.id)}
                        </div>
                        {gw.badge && (
                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm ${
                              gw.isRecommended
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                            {gw.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        {gw.description}
                      </p>

                      {/* Branded Payment Method Badges */}
                      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                        {gw.paymentMethods.map((method, idx) => (
                          <PaymentMethodBadge key={idx} name={method} />
                        ))}
                      </div>
                    </div>

                    {/* Radio Selector */}
                    <div className="pt-0.5 ml-2">
                      <div
                        className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-300 bg-transparent'
                        }`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Terms of Service & Non-Refundable Policy Agreement Callout */}
        {!isDowngrade && (
          <div className="mt-5 space-y-3">
            <div className="p-3.5 rounded-sm bg-blue-50/70 border border-blue-200/70 text-blue-900 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-blue-950">
                  No-Refund & Digital Service Policy
                </p>
                <p className="text-blue-800 leading-relaxed text-[11px]">
                  Subscriptions provide immediate digital portfolio hosting,
                  custom subdomain publishing, and instant access to platform
                  tools. All subscription and upgrade charges are final and
                  non-refundable once activated.
                </p>
              </div>
            </div>

            {/* Checkbox Input Validation */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none group p-1">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={handleCheckboxChange}
                disabled={isLoading}
                className="mt-0.5 w-4 h-4 rounded-sm border-gray-300 text-primary focus:ring-primary cursor-pointer shrink-0"
              />
              <span className="text-xs text-gray-700 leading-tight group-hover:text-gray-900">
                I agree to the{' '}
                <span className="font-semibold text-[#111620] underline">
                  Terms of Service
                </span>{' '}
                and acknowledge that subscription fees are{' '}
                <span className="font-semibold text-[#111620]">
                  non-refundable once service is activated
                </span>
                .
              </span>
            </label>

            {validationError && (
              <p className="text-xs text-rose-600 font-medium animate-in fade-in flex items-center gap-1.5 pl-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {validationError}
              </p>
            )}
          </div>
        )}

        {/* Security Assurance */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-gray-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-bit SSL encrypted & bank-grade verified checkout</span>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto border-gray-200 text-gray-700 hover:bg-gray-50 rounded-sm h-10 px-5 font-semibold text-xs">
            {isDowngrade ? 'Close' : 'Cancel'}
          </Button>

          {!isDowngrade && (
            <Button
              type="button"
              onClick={handleProceed}
              disabled={isLoading || !acceptedTerms}
              className={`w-full sm:w-auto font-bold rounded-sm h-10 px-6 shadow-sm flex items-center justify-center gap-2 text-xs transition-opacity ${
                !acceptedTerms
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
                  : 'bg-primary hover:bg-[#d62828] text-white cursor-pointer'
              }`}>
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : isInstantUpgrade ? (
                <>
                  <span>Confirm Instant Upgrade (0 {currency})</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>
                    Pay {currency} {finalPayable.toLocaleString()} via{' '}
                    {gateways.find((g) => g.id === selectedGateway)?.name ||
                      'Checkout'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
