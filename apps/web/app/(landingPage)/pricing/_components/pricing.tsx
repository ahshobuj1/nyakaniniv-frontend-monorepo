'use client';

import React, {useState} from 'react';
import {Check, X, Zap} from 'lucide-react';
import {NumberFlow} from '@repo/ui';

type Feature = {
  name: string;
  included: boolean;
};

type Plan = {
  name: string;
  info: string;
  price: {
    monthly: number;
    yearly: number;
  };
  period: string;
  features: Feature[];
  btnText: string;
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: 'Starter',
    info: 'Perfect for getting started',
    price: {
      monthly: 0,
      yearly: 0,
    },
    period: '/forever',
    features: [
      {name: 'Personal DJ website', included: true},
      {name: 'Up to 3 mixtape uploads', included: true},
      {name: 'Basic booking form', included: true},
      {name: '5 events per month', included: true},
      {name: 'UpBeat Africa subdomain', included: true},
      {name: 'Social media integration', included: true},
      {name: 'Email support', included: true},
      {name: 'Exclusive merchandise store', included: false},
      {name: 'Premium mixtape analytics', included: false},
      {name: 'Unlimited event listings', included: false},
    ],
    btnText: 'Get Started Free',
  },
  {
    name: 'Pro',
    info: 'For serious DJs growing their brand',
    price: {
      monthly: 29,
      yearly: 24,
    },
    period: '/per month',
    features: [
      {name: 'Everything in Starter', included: true},
      {name: 'Unlimited mixtape uploads', included: true},
      {name: 'Sub domain support', included: true},
      {name: 'Invoice generation', included: true},
      {name: 'Advanced analytics', included: true},
      {name: 'Payment processing (Paystack)', included: true},
      {name: '20 events per month', included: true},
      {name: 'Priority support', included: true},
      {name: 'Theme customization', included: true},
      {name: 'Gallery management', included: true},
    ],
    btnText: 'Start Pro',
    highlighted: true,
  },
  {
    name: 'Business',
    info: 'For established DJs & agencies',
    price: {
      monthly: 69,
      yearly: 57,
    },
    period: '/per month',
    features: [
      {name: 'Everything in Pro', included: true},
      {name: 'Multiple DJ profiles', included: true},
      {name: 'Team management', included: true},
      {name: 'White-label option', included: true},
      {name: 'API access', included: true},
      {name: 'Dedicated account manager', included: true},
      {name: 'Unlimited events', included: true},
      {name: 'Advanced VAT/tax tools', included: true},
      {name: 'Custom invoicing', included: true},
      {name: 'SLA guarantee', included: true},
    ],
    btnText: 'Start Business',
  },
];

export default function PricingSection() {
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="bg-[#f2f2f2] min-h-screen py-16 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1.5 bg-red-50 text-primary px-3 py-1.5 rounded text-xs font-semibold border border-red-100">
            <Zap size={14} fill="currentColor" className="text-primary" />
            Simple, Transparent Pricing
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center text-gray-900 mb-3">
          Choose your plan
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Start free, scale as you grow. All prices shown in USD.
        </p>

        <div className="flex justify-center mb-16">
          <div className="bg-white p-1.5 rounded shadow-sm inline-flex items-center">
            <button
              onClick={() => setFrequency('monthly')}
              className={`px-6 py-2 cursor-pointer rounded-[2px] text-sm font-semibold transition-all duration-300 ${
                frequency === 'monthly'
                  ? 'bg-primary text-white'
                  : 'text-gray-900'
              }`}>
              Monthly
            </button>
            <button
              onClick={() => setFrequency('yearly')}
              className={`px-6 py-2 cursor-pointer rounded-[2px] text-sm font-semibold flex items-center gap-2 transition-all duration-300 ${
                frequency === 'yearly'
                  ? 'bg-primary text-white'
                  : 'text-gray-900'
              }`}>
              Annual
              <span className="bg-[#00c48c] text-white text-[10px] px-1.5 py-0.5 rounded-sm">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative ${plan.highlighted ? '' : 'bg-white p-8 shadow-sm'}`}>
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00c48c] text-white px-3 py-1 text-xs font-semibold rounded-sm z-10">
                  Most Popular
                </div>
              )}
              <div
                className={
                  plan.highlighted
                    ? 'bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative'
                    : ''
                }>
                <h3 className="text-[28px] font-bold text-gray-900 mb-1">
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm mb-6">{plan.info}</p>
                <div className="flex items-baseline mb-8">
                  <span className="text-6xl font-bold text-gray-900 flex items-center">
                    $
                    <NumberFlow
                      value={plan.price[frequency]}
                      format={{useGrouping: false}}
                      className="font-bold"
                    />
                  </span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
                <button
                  className={`w-full py-2.5 font-bold mb-8 transition-colors duration-300 ${
                    plan.highlighted
                      ? 'bg-primary text-white hover:bg-[#e63535]'
                      : 'border-2 border-gray-900 text-gray-900 hover:bg-gray-50'
                  }`}>
                  {plan.btnText}
                </button>
                <ul className="space-y-3.5">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {feature.included ? (
                        <span className="bg-emerald-100/50 text-emerald-500 p-0.5 rounded">
                          <Check size={14} strokeWidth={4} />
                        </span>
                      ) : (
                        <span className="bg-red-100/50 text-red-500 p-0.5 rounded">
                          <X size={14} strokeWidth={4} />
                        </span>
                      )}
                      <span
                        className={
                          feature.included
                            ? 'text-gray-600 text-sm'
                            : 'text-gray-400 text-sm'
                        }>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-gray-900 font-medium">
          Running a DJ agency or label?{' '}
          <a
            href="#"
            className="text-primary hover:underline transition-colors duration-300">
            Contact us for Enterprise pricing &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
