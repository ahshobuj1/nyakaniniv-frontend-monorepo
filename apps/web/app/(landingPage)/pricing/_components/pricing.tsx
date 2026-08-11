'use client';

import React, {useState} from 'react';
import {Check, X, Zap} from 'lucide-react';
import {NumberFlow} from '@repo/ui';
import {useGetPlansQuery, useGetCurrentProfileQuery, SubscriptionPlan} from '@repo/store';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import Link from 'next/link';

const ALL_FEATURES = [
  { key: 'CUSTOM_SUBDOMAIN', label: 'Custom Subdomain' },
  { key: 'BASIC_PROFILE', label: 'Basic DJ Profile' },
  { key: 'MANUAL_BOOKINGS', label: 'Manual Bookings' },
  { key: 'ONLINE_PAYMENTS', label: 'Online Payments (Paystack)' },
  { key: 'AUTOMATED_INVOICING', label: 'Automated Invoicing' },
  { key: 'MULTIPLE_THEMES', label: 'Multiple Themes' },
  { key: 'EMAIL_NOTIFICATIONS', label: 'Email Notifications' },
  { key: 'BASIC_ANALYTICS', label: 'Basic Analytics' },
  { key: 'ADVANCED_ANALYTICS', label: 'Advanced Analytics' },
  { key: 'CUSTOM_DOMAIN', label: 'Custom Domain' },
  { key: 'REMOVE_BRANDING', label: 'Remove Upbeat Branding' },
  { key: 'PRIORITY_SUPPORT', label: 'Priority Support' },
  { key: 'MAX_EVENTS', label: 'Events per Month' }
];

export default function PricingSection() {
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const { data: plansResponse, isLoading } = useGetPlansQuery();
  const { data: profileResponse, isLoading: isProfileLoading } = useGetCurrentProfileQuery();
  const router = useRouter();

  const plans = plansResponse?.data || [];

  const handleSubscribeClick = () => {
    if (isProfileLoading) return;
    const isLogged = profileResponse?.data && (profileResponse?.data as any)?.id;
    
    if (isLogged) {
      router.push('/dashboard/billing');
    } else {
      toast.error('You need to be logged in to subscribe.', {
        description: 'Redirecting to login page...',
      });
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    }
  };

  return (
    <div className="bg-[#f2f2f2] min-h-screen py-16 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
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
          Start free, scale as you grow. All prices shown in KES.
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
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map((plan: SubscriptionPlan, idx: number) => {
              const isPopular = idx === 1; // Highlight the middle plan
              const price = frequency === 'monthly' ? Number(plan.priceMonthly) : Number(plan.priceAnnually);
              
              let featuresObj: any = {};
              if (typeof plan.features === 'string') {
                try { featuresObj = JSON.parse(plan.features); } catch(e){}
              } else if (plan.features && typeof plan.features === 'object') {
                featuresObj = plan.features;
              }

              const renderedFeatures = ALL_FEATURES.map(f => {
                const val = featuresObj[f.key];
                const included = val === true || (typeof val === 'number' && val > 0) || val === -1;
                let text = f.label;
                if (f.key === 'MAX_EVENTS') {
                  if (val === -1) text = 'Unlimited Events';
                  else if (val) text = `Up to ${val} Events/month`;
                  else text = 'No Events allowed';
                }
                return { name: text, included };
              });

              return (
                <div
                  key={plan.id}
                  className={`relative ${!isPopular ? 'bg-white p-8 shadow-sm' : ''}`}>
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00c48c] text-white px-3 py-1 text-xs font-semibold rounded-sm z-10">
                      Most Popular
                    </div>
                  )}
                  <div
                    className={
                      isPopular
                        ? 'bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative'
                        : ''
                    }>
                    <h3 className="text-[28px] font-bold text-gray-900 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 min-h-10">
                      Elevate your DJ career with our powerful tools.
                    </p>
                    <div className="flex items-baseline mb-8">
                      <span className="text-gray-900 flex items-center tracking-tight">
                        KES
                        <NumberFlow
                          value={price}
                          format={{useGrouping: false}}
                          className="text-6xl font-bold ml-1"
                        />
                      </span>

                      
                      <span className="text-gray-500 ml-1">/{frequency === 'monthly' ? 'month' : 'year'}</span>
                      {plan.discountPercentage ? (
                        <div className="ml-auto flex items-center">
                          <span className="bg-rose-100 text-rose-600 border border-rose-200 px-2.5 py-1 text-[11px] font-extrabold capitalize tracking-widest rounded-full shadow-sm animate-pulse">
                            Yearly Save {plan.discountPercentage}%
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <button
                      onClick={handleSubscribeClick}
                      className={`w-full py-2.5 font-bold mb-8 transition-colors duration-300 cursor-pointer ${
                        isPopular
                          ? 'bg-primary text-white hover:bg-[#e63535]'
                          : 'border-2 border-gray-900 text-gray-900 hover:bg-gray-50'
                      }`}>
                      Get Started
                    </button>
                    <ul className="space-y-3.5">
                      {renderedFeatures.map((feature: any, index: number) => (
                        <li key={index} className={`flex items-start gap-3 ${feature.included ? '' : 'opacity-50'}`}>
                          {feature.included !== false ? (
                            <span className="bg-emerald-100/50 text-emerald-500 p-0.5 rounded mt-0.5 shrink-0">
                              <Check size={14} strokeWidth={4} />
                            </span>
                          ) : (
                            <span className="bg-red-100/50 text-red-500 p-0.5 rounded mt-0.5 shrink-0">
                              <X size={14} strokeWidth={4} />
                            </span>
                          )}
                          <span
                            className={
                              feature.included !== false
                                ? 'text-gray-600 text-sm leading-tight'
                                : 'text-gray-400 text-sm leading-tight'
                            }>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-16 text-center text-gray-900 font-medium">
          Running a DJ agency or label?{' '}
          <Link
            href="/support"
            className="text-primary hover:underline transition-colors duration-300">
            Contact us for Enterprise pricing &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
