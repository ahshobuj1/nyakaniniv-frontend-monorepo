'use client';

import {useState} from 'react';
import {Zap, Check, X, Calendar, CheckCircle2} from 'lucide-react';
import {Card, CardContent, Button, Badge, NumberFlow} from '@repo/ui';

// ==========================================
// 1. Types & Dummy Data (Pricing)
// ==========================================
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

// ==========================================
// 2. Dummy Data (Billing History)
// ==========================================
interface BillingHistory {
  id: string;
  description: string;
  date: string;
  amount: string;
  status: 'paid' | 'free';
}

const billingHistoryData: BillingHistory[] = [
  {
    id: 'PAY-001',
    description: 'Pro Plan - October 2026',
    date: '22 Dec 2025',
    amount: '29',
    status: 'paid',
  },
  {
    id: 'PAY-002',
    description: 'Pro Plan - September 2025',
    date: '01 Jan 2026',
    amount: '29',
    status: 'paid',
  },
  {
    id: 'PAY-003',
    description: 'Pro Plan - August 2025',
    date: '14 Feb 2026',
    amount: '29',
    status: 'paid',
  },
  {
    id: 'PAY-004',
    description: 'Pro Plan - Trial Period',
    date: '03 Mar 2026',
    amount: 'Free',
    status: 'free',
  },
];

// ==========================================
// 3. Main Page Component
// ==========================================
export default function BillingSubscriptionPage() {
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen p-4 md:p-4 ">
      <div className="mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold tracking-tight text-[#111620]">
            Billing & Subscription
          </h1>
          <p className="text-[#787878] text-[15px]">
            Manage your plan, payment methods and billing history.
          </p>
        </div>

        {/* Current Plan & Usage Section */}
        <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden rounded-2xl bg-white">
          <CardContent className="p-0">
            {/* Current Plan Row */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-[#F5F5F5] flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-[#111620]" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-[20px] font-bold text-[#111620]">
                      Pro Plan
                    </h2>
                    <Badge className="bg-primary hover:bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      ACTIVE
                    </Badge>
                  </div>
                  <p className="text-[#787878] text-[14px]">
                    KES 28/month · Renews November 1, 2024
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                <Button
                  variant="secondary"
                  className="flex-1 md:flex-none bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#111620] font-semibold h-11 rounded-lg">
                  Cancel Plan
                </Button>
                <Button className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-white font-semibold h-11 rounded-lg shadow-sm">
                  Upgrade to Business
                </Button>
              </div>
            </div>

            {/* Plan Usage Row */}
            <div className="p-6 md:p-8 space-y-6">
              <h3 className="text-[16px] font-bold text-[#111620]">
                Plan Usage
              </h3>

              <div className="space-y-5">
                {/* Usage 1 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[14px] text-[#787878]">
                      Mixtape Uploads
                    </span>
                    <span className="text-[14px] font-medium text-[#111620]">
                      5 / Unlimited
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F5F5F5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#10B981] rounded-full w-[15%]"></div>
                  </div>
                </div>

                {/* Usage 2 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[14px] text-[#787878]">
                      Events This Month
                    </span>
                    <span className="text-[14px] font-medium text-[#111620]">
                      15 / 20
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F5F5F5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#F59E0B] rounded-full w-[75%]"></div>
                  </div>
                </div>

                {/* Usage 3 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[14px] text-[#787878]">
                      Booking Requests
                    </span>
                    <span className="text-[14px] font-medium text-[#111620]">
                      11 / 11
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F5F5F5] rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing/Available Plans Section (Reused Code adapted for layout) */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-[20px] font-bold text-[#111620]">
              Available Plans
            </h2>

            {/* Toggle Monthly/Yearly */}
            <div className="bg-[#E5E7EB] p-1 rounded-lg inline-flex items-center">
              <button
                onClick={() => setFrequency('monthly')}
                className={`px-5 py-2 rounded-md text-[13px] font-bold transition-all duration-300 ${
                  frequency === 'monthly'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-[#787878] hover:text-[#111620]'
                }`}>
                Monthly
              </button>
              <button
                onClick={() => setFrequency('yearly')}
                className={`px-5 py-2 rounded-md text-[13px] font-bold flex items-center gap-2 transition-all duration-300 ${
                  frequency === 'yearly'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-[#787878] hover:text-[#111620]'
                }`}>
                Annual
                <span className="bg-white/20 text-inherit text-[10px] px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                  (Save 17%)
                </span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative h-full ${
                  plan.highlighted
                    ? 'bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-primary'
                    : 'bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] border-2 border-transparent'
                }`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#10B981] text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full z-10">
                    Most Popular
                  </div>
                )}

                <div className="p-8 flex flex-col h-full">
                  <h3 className="text-[24px] font-bold text-[#111620] mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-[#787878] text-[14px] mb-6 min-h-10">
                    {plan.info}
                  </p>

                  <div className="flex items-baseline mb-8">
                    <span className="text-[#111620] flex items-center tracking-tight">
                      KES
                      <NumberFlow
                        value={plan.price[frequency]}
                        format={{useGrouping: false}}
                        className="font-bold text-[48px]"
                      />
                    </span>
                    <span className="text-[#787878] text-[14px] ml-1 font-medium">
                      {plan.period}
                    </span>
                  </div>

                  <button
                    className={`w-full py-3.5 rounded-lg font-bold mb-8 transition-colors duration-300 text-[15px] ${
                      plan.highlighted
                        ? 'bg-[#E5E7EB] text-[#111620] hover:bg-[#D1D5DB]'
                        : 'border border-[#E5E7EB] text-[#111620] hover:bg-[#F5F5F5]'
                    }`}>
                    {plan.btnText}
                  </button>

                  <ul className="space-y-4 grow">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <span className="bg-[#10B981]/10 text-[#10B981] p-0.5 rounded mt-0.5 shrink-0">
                            <Check size={14} strokeWidth={3} />
                          </span>
                        ) : (
                          <span className="bg-primary/10 text-primary p-0.5 rounded mt-0.5 shrink-0">
                            <X size={14} strokeWidth={3} />
                          </span>
                        )}
                        <span
                          className={`text-[14px] leading-tight ${
                            feature.included
                              ? 'text-[#111620]'
                              : 'text-[#A1A1AA]'
                          }`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History Table */}
        <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden rounded-2xl bg-white">
          <CardContent className="p-0">
            <div className="p-6 md:p-8 border-b-4 border-gray-100">
              <h2 className="text-[18px] font-bold text-[#111620]">
                Billing History
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-200 text-left border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                      Payment ID
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[35%]">
                      Description
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                      Date
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] tracking-wider w-[15%]">
                      Amount (KES)
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[15%]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistoryData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`${index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} hover:bg-gray-100/50 transition-colors`}>
                      <td className="py-5 px-8 text-[14px] font-bold text-[#111620]">
                        {item.id}
                      </td>
                      <td className="py-5 px-8 text-[14px] text-[#787878]">
                        {item.description}
                      </td>
                      <td className="py-5 px-8 text-[14px] text-[#787878]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#A1A1AA]" />
                          {item.date}
                        </div>
                      </td>
                      <td className="py-5 px-8 text-[14px] font-bold text-[#111620]">
                        {item.amount}
                      </td>
                      <td className="py-5 px-8">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white text-[12px] font-bold uppercase tracking-wider ${
                            item.status === 'paid'
                              ? 'bg-[#10B981]'
                              : 'bg-[#10B981]' // Both green based on screenshot
                          }`}>
                          {item.status === 'paid' && (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          {item.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
