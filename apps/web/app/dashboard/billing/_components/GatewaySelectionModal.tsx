'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@repo/ui';
import {
  PaystackBrandLogo,
  PesapalBrandLogo,
  FlutterwaveBrandLogo,
  PaymentMethodBadge,
} from '@/components/payment/PaymentMethodLogos';
import { GatewaySelectionModalProps, GatewayCardOption } from '@/types/payment.types';

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
}: GatewaySelectionModalProps) {
  const normalizedCountry = (tenantCountry || '').trim().toLowerCase();
  const isEastAfrica = ['tanzania', 'tz', 'kenya', 'ke', 'uganda', 'ug', 'rwanda', 'rw'].includes(normalizedCountry);

  // Pre-select based on tenant country
  const [selectedGateway, setSelectedGateway] = useState<string>(isEastAfrica ? 'pesapal' : 'paystack');

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedGateway(isEastAfrica ? 'pesapal' : 'paystack');
    }
  }, [isOpen, isEastAfrica]);

  if (!isOpen) return null;

  const gateways: GatewayCardOption[] = [
    {
      id: 'pesapal',
      name: 'Pesapal',
      title: 'Pesapal Mobile Money & Cards',
      description: 'Instant local checkout via M-Pesa, Tigo Pesa, Airtel Money & Visa/Mastercard',
      badge: isEastAfrica ? 'Recommended for East Africa' : 'East Africa Mobile Money',
      currencies: ['TZS', 'KES', 'UGX', 'USD'],
      isRecommended: isEastAfrica,
      paymentMethods: ['M-Pesa', 'Tigo Pesa', 'Airtel Money', 'Visa', 'Mastercard'],
    },
    {
      id: 'paystack',
      name: 'Paystack',
      title: 'Paystack Direct Checkout',
      description: 'Instant card payments, direct bank transfer, Apple Pay & Verve debit',
      badge: !isEastAfrica ? 'Recommended' : 'Cards & Bank Transfer',
      currencies: ['KES', 'NGN', 'GHS', 'ZAR', 'USD'],
      isRecommended: !isEastAfrica,
      paymentMethods: ['Visa', 'Mastercard', 'Bank Transfer', 'Apple Pay', 'Verve'],
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      title: 'Flutterwave Pan-African',
      description: 'Pan-African payments across 15+ currencies with local cards and bank wires',
      badge: 'Pan-African Multi-Currency',
      currencies: ['KES', 'NGN', 'GHS', 'ZAR', 'USD', 'TZS', 'UGX', 'RWF'],
      isRecommended: false,
      paymentMethods: ['Visa', 'Mastercard', 'Mobile Money', 'Bank Wire'],
    },
  ];

  const handleProceed = async () => {
    await onSelectGateway(selectedGateway);
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
        className="relative w-full max-w-xl rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 text-[#111620] shadow-2xl overflow-hidden transition-all max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative flex items-start justify-between pb-5 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-3 h-3 text-primary" />
                Secure Subscription Checkout
              </span>
              {tenantCountry ? (
                <span className="text-[11px] text-gray-500 uppercase font-medium tracking-wider">
                  • {tenantCountry}
                </span>
              ) : null}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111620]">
              Select Payment Method
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              Choose your preferred payment gateway with authentic local & international payment options.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl p-2 text-gray-400 hover:text-[#111620] hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan summary badge */}
        <div className="mt-5 p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Selected Subscription Plan</p>
            <p className="text-sm font-bold text-[#111620]">{planName}</p>
          </div>
          {price !== undefined && (
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium capitalize">{billingCycle}</p>
              <p className="text-base font-black text-primary font-mono">
                {currency} {price.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Gateway Selection Cards */}
        <div className="mt-5 space-y-3.5">
          {gateways.map((gw) => {
            const isSelected = selectedGateway === gw.id;
            return (
              <div
                key={gw.id}
                onClick={() => !isLoading && setSelectedGateway(gw.id)}
                className={`relative rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all duration-200 select-none ${
                  isSelected
                    ? 'border-primary bg-primary/[0.04] ring-2 ring-primary/20 shadow-xs'
                    : 'bg-white border-gray-200 hover:bg-gray-50/70 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    {/* Gateway Header with Logo & Badges */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        {renderGatewayLogo(gw.id)}
                      </div>
                      {gw.badge && (
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                            gw.isRecommended
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
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
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 bg-transparent'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
            className="w-full sm:w-auto border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-11 px-5 font-semibold text-xs"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleProceed}
            disabled={isLoading}
            className="w-full sm:w-auto bg-primary hover:bg-[#d62828] text-white font-bold rounded-xl h-11 px-6 shadow-md shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <span>Continue to {gateways.find(g => g.id === selectedGateway)?.name || 'Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
