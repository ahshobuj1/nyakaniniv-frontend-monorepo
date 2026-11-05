/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {useState, useMemo, useEffect, useRef} from 'react';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';

import {
  Zap,
  Check,
  X,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Receipt,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import {Card, CardContent, Badge, NumberFlow} from '@repo/ui';
import {
  useGetPlansQuery,
  useGetMySubscriptionQuery,
  useSubscribeMutation,
  useGetMyInvoicesQuery,
  SubscriptionPlan,
  useGetCurrentProfileQuery,
  useLazyPreviewUpgradeQuery,
  UpgradePreviewResponse,
  useVerifyPaymentMutation,
} from '@repo/store';
import GatewaySelectionModal from './GatewaySelectionModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import {getSubscriptionDaysRemaining} from '@/lib/bookingStatusHelper';
import {getCurrencyForCountry} from '@/lib/currency';

const ALL_FEATURES = [
  {key: 'CUSTOM_SUBDOMAIN', label: 'Custom Subdomain'},
  {key: 'BASIC_PROFILE', label: 'Basic DJ Profile'},
  {key: 'MANUAL_BOOKINGS', label: 'Manual Bookings'},
  {key: 'ONLINE_PAYMENTS', label: 'Online Payments (Paystack)'},
  {key: 'AUTOMATED_INVOICING', label: 'Automated Invoicing'},
  {key: 'MULTIPLE_THEMES', label: 'Multiple Themes'},
  {key: 'EMAIL_NOTIFICATIONS', label: 'Email Notifications'},
  {key: 'BASIC_ANALYTICS', label: 'Basic Analytics'},
  {key: 'ADVANCED_ANALYTICS', label: 'Advanced Analytics'},
  {key: 'CUSTOM_DOMAIN', label: 'Custom Domain'},
  {key: 'REMOVE_BRANDING', label: 'Remove Upbeat Branding'},
  {key: 'PRIORITY_SUPPORT', label: 'Priority Support'},
  {key: 'MAX_EVENTS', label: 'Events per Month'},
];

import {toast} from 'sonner';

export default function BillingSubscriptionPage() {
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const {data: profileResponse} = useGetCurrentProfileQuery();
  const tenant = profileResponse?.data?.tenant;
  const tenantCountry = (tenant?.country || '').trim();
  const tenantCurrency = (tenant?.currencyCode || '').trim().toUpperCase();

  const SUPPORTED_BILLING_CURRENCIES = [
    'KES',
    'NGN',
    'GHS',
    'ZAR',
    'UGX',
    'TZS',
    'RWF',
  ];

  // Resolve country's currency from country code
  const countryCurrency = (
    getCurrencyForCountry(tenantCountry) || ''
  ).toUpperCase();

  // If the country has a supported local billing currency, use it (e.g. Kenya -> KES, Nigeria -> NGN, Ghana -> GHS).
  // If the country is outside supported regional billing currencies, it defaults to KES.
  let selectedCurrency = 'KES';
  if (SUPPORTED_BILLING_CURRENCIES.includes(countryCurrency)) {
    selectedCurrency = countryCurrency;
  } else if (
    tenantCurrency &&
    SUPPORTED_BILLING_CURRENCIES.includes(tenantCurrency) &&
    (!tenantCountry || tenantCurrency === countryCurrency)
  ) {
    selectedCurrency = tenantCurrency;
  }

  const {data: plansResponse, isLoading: isLoadingPlans} = useGetPlansQuery({
    currency: selectedCurrency,
  });
  const {
    data: subResponse,
    isLoading: isLoadingSub,
    refetch: refetchSub,
  } = useGetMySubscriptionQuery();
  const {data: invoicesResponse, isLoading: isLoadingInvoices} =
    useGetMyInvoicesQuery();

  const [subscribe, {isLoading: isSubscribing}] = useSubscribeMutation();

  const [triggerPreview, {isFetching: isPreviewing}] =
    useLazyPreviewUpgradeQuery();
  const [upgradePreview, setUpgradePreview] =
    useState<UpgradePreviewResponse | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifyPayment] = useVerifyPaymentMutation();
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    if (hasVerifiedRef.current) return;

    const success = searchParams.get('success');
    const orderTrackingId =
      searchParams.get('OrderTrackingId') ||
      searchParams.get('orderTrackingId');
    const reference =
      searchParams.get('reference') ||
      searchParams.get('OrderMerchantReference') ||
      searchParams.get('orderMerchantReference');

    if (orderTrackingId || (success === 'true' && reference)) {
      hasVerifiedRef.current = true;
      const toastId = toast.loading('Verifying subscription payment...');
      verifyPayment({
        orderTrackingId: orderTrackingId || undefined,
        reference: reference || undefined,
      })
        .unwrap()
        .then(() => {
          toast.success('Payment verified! Your subscription is now active.', {
            id: toastId,
          });
          refetchSub();
          router.replace('/dashboard/billing');
        })
        .catch((err: any) => {
          toast.info(
            err?.data?.message ||
              'Payment received. Refreshing subscription status...',
            {id: toastId},
          );
          refetchSub();
        });
    }
  }, [searchParams, verifyPayment, refetchSub, router]);

  const plans = useMemo(() => {
    const raw = plansResponse?.data || [];
    return [...raw].sort(
      (a: any, b: any) => (Number(a.id) || 0) - (Number(b.id) || 0),
    );
  }, [plansResponse?.data]);
  const activeSubscription = subResponse?.data;

  const daysRemaining = getSubscriptionDaysRemaining(
    activeSubscription?.periodEnd,
  );

  const isGracePeriod = Boolean(
    activeSubscription?.isGracePeriod ||
    activeSubscription?.status === 'past_due',
  );
  const canRenew = Boolean(
    activeSubscription &&
    (isGracePeriod ||
      activeSubscription.canRenew ||
      (daysRemaining !== null && daysRemaining <= 7)),
  );

  // Filter only PAID subscription purchases for subscription history
  const rawInvoices = Array.isArray(invoicesResponse?.data)
    ? invoicesResponse.data
    : (invoicesResponse as any)?.data?.data || [];
  const subscriptionHistory = rawInvoices.filter(
    (inv: any) =>
      inv.type === 'SUBSCRIPTION' && inv.status?.toLowerCase() === 'paid',
  );

  const [gatewayModalOpen, setGatewayModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const handleSubscribeClick = async (planId: number) => {
    setSelectedPlanId(planId);
    if (activeSubscription) {
      try {
        const res = await triggerPreview({
          planId,
          billingCycle: frequency === 'monthly' ? 'monthly' : 'annually',
          currency: selectedCurrency,
        }).unwrap();
        setUpgradePreview(res?.data || null);
      } catch (err: any) {
        toast.error(
          err?.data?.error?.message ||
            err?.data?.message ||
            'Could not calculate upgrade breakdown',
        );
      }
    } else {
      setUpgradePreview(null);
    }
    setGatewayModalOpen(true);
  };

  const handleProceedSubscription = async (gateway?: string) => {
    if (!selectedPlanId) return;
    try {
      const result = await subscribe({
        planId: selectedPlanId,
        billingCycle: frequency === 'monthly' ? 'monthly' : 'annually',
        currency: selectedCurrency,
        successUrl: window.location.origin + '/dashboard/billing?success=true',
        cancelUrl: window.location.origin + '/dashboard/billing?canceled=true',
        gateway,
      }).unwrap();

      if (result?.data?.isInstantUpgrade) {
        toast.success(
          result.data.message ||
            'Plan upgraded successfully using remaining balance!',
        );
        setGatewayModalOpen(false);
        refetchSub();
        return;
      }

      if (result?.data?.url) {
        window.location.assign(result.data.url);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.error?.message ||
          error?.data?.message ||
          'Failed to initiate subscription',
      );
    }
    setGatewayModalOpen(false);
  };

  const selectedPlan = plans.find((p: any) => p.id === selectedPlanId);

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen p-4 md:p-4">
      <div className="mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold tracking-tight text-[#111620]">
            Billing & Subscription
          </h1>
          <p className="text-[#787878] text-[14px]">
            Manage your plan, upgrade anytime with prorated credit, and review
            invoices.
          </p>
        </div>

        {/* Grace Period Warning Banner */}
        {activeSubscription && isGracePeriod && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-950 p-4 md:p-5 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs animate-in fade-in">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5 text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-[15px] text-amber-950">
                  7-Day Grace Period Active (
                  {activeSubscription.graceDaysRemaining || 7} Days Left)
                </p>
                <p className="text-[13px] text-amber-900/80 leading-relaxed">
                  Your subscription cycle has ended. Your public DJ portfolio
                  website remains <strong>online</strong> during this 7-day
                  grace period. Renew now to avoid any interruption.
                </p>
              </div>
            </div>
            {activeSubscription.planId && (
              <button
                onClick={() => handleSubscribeClick(activeSubscription.planId!)}
                disabled={isSubscribing || isPreviewing}
                className="bg-primary hover:bg-[#d62828] text-white font-bold text-[13px] px-5 py-2.5 rounded-sm shrink-0 shadow-sm cursor-pointer transition-colors flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Renew Plan Now</span>
              </button>
            )}
          </div>
        )}

        {/* Current Plan & Usage Section */}
        {isLoadingSub ? (
          <LoadingSpinner smallHeight />
        ) : activeSubscription ? (
          <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden rounded-sm bg-white">
            <CardContent className="p-0">
              {/* Current Plan Row */}
              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-sm bg-[#F5F5F5] flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-[#111620]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-[20px] font-bold text-[#111620]">
                        {activeSubscription.plan?.name || 'Active Plan'}
                      </h2>
                      <Badge
                        variant="outline"
                        className="text-[11px] font-bold px-2 py-0.5 rounded-sm border-gray-300 text-gray-700 bg-gray-50 capitalize">
                        {activeSubscription.billingCycle === 'annually'
                          ? 'Annual Plan'
                          : 'Monthly Plan'}
                      </Badge>
                      <Badge
                        className={`text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                          isGracePeriod
                            ? 'bg-amber-600 hover:bg-amber-600'
                            : activeSubscription.status === 'active'
                              ? 'bg-primary hover:bg-primary'
                              : 'bg-gray-600 hover:bg-gray-600'
                        }`}>
                        {isGracePeriod
                          ? 'GRACE PERIOD'
                          : activeSubscription.status === 'active'
                            ? 'ACTIVE'
                            : activeSubscription.status}
                      </Badge>
                    </div>
                    <p className="text-[#787878] text-[14px]">
                      {isGracePeriod && activeSubscription.periodEnd
                        ? `Expired on ${new Date(activeSubscription.periodEnd).toLocaleDateString('en-GB')} (Grace period active)`
                        : activeSubscription.periodEnd
                          ? `Valid until ${new Date(activeSubscription.periodEnd).toLocaleDateString('en-GB')}`
                          : 'Prepaid Active'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  {canRenew && activeSubscription.planId && (
                    <button
                      onClick={() =>
                        handleSubscribeClick(activeSubscription.planId!)
                      }
                      disabled={isSubscribing || isPreviewing}
                      className="bg-primary hover:bg-[#d62828] text-white font-bold text-[13px] px-4 py-2 rounded-sm shadow-xs cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
                      <Zap className="w-4 h-4" />
                      <span>Renew Subscription</span>
                    </button>
                  )}

                  {daysRemaining !== null && !isGracePeriod && (
                    <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] px-3.5 py-2 rounded-sm text-[13px] text-[#374151]">
                      <Calendar className="w-4 h-4 text-[#6B7280]" />
                      <span>
                        {daysRemaining > 0 ? (
                          <>
                            <strong className="font-semibold text-[#111620]">
                              {daysRemaining}
                            </strong>{' '}
                            {daysRemaining === 1
                              ? 'day remaining'
                              : 'days remaining'}
                          </>
                        ) : (
                          <span className="font-semibold text-amber-600">
                            Expires today
                          </span>
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#DCFCE7] px-3.5 py-2 rounded-sm text-[13px] text-[#166534]">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                    <span className="font-medium">Portfolio Live</span>
                  </div>

                  <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] px-3.5 py-2 rounded-sm text-[13px] text-[#6B7280]">
                    <ShieldCheck className="w-4 h-4 text-[#059669]" />
                    <span>Prepaid (No Auto-Debit)</span>
                  </div>
                </div>
              </div>

              {/* Informative footer bar */}
              <div className="bg-[#FAFBFB] px-6 md:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px] text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>
                    Your subscription is active for the full prepaid term
                    without recurring charges. Upgrade anytime with automatic
                    prorated credit.
                  </span>
                </div>
                <div className="shrink-0 text-[12px] font-medium text-[#9CA3AF]">
                  Non-recurring billing
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden rounded-sm bg-white">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-sm bg-amber-50 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-[20px] font-bold text-[#111620]">
                      No Active Subscription
                    </h2>
                    <Badge className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
                      INACTIVE
                    </Badge>
                  </div>
                  <p className="text-[#787878] text-[14px]">
                    Your DJ portfolio website is currently offline. Choose a
                    plan below to publish your portfolio.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Plans Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-[20px] font-bold text-[#111620]">
                Available Plans
              </h2>
              <p className="text-[#787878] text-[14px]">
                Upgrade anytime. Unused days on your current plan will be
                credited automatically.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-sm px-3 py-1.5 shadow-xs">
                <span className="text-[12px] text-[#787878] font-medium">Currency:</span>
                <span className="text-[13px] font-bold text-[#111620]">{selectedCurrency}</span>
              </div> */}

              {/* Toggle Monthly/Yearly */}
              <div className="bg-[#E5E7EB] p-1 rounded-sm inline-flex items-center">
                <button
                  onClick={() => setFrequency('monthly')}
                  className={`px-5 py-2 rounded-sm text-[13px] font-bold transition-all duration-300 cursor-pointer ${
                    frequency === 'monthly'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-[#787878] hover:text-[#111620]'
                  }`}>
                  Monthly
                </button>
                <button
                  onClick={() => setFrequency('yearly')}
                  className={`px-5 py-2 rounded-sm text-[13px] font-bold flex items-center gap-2 cursor-pointer transition-all duration-300 ${
                    frequency === 'yearly'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-[#787878] hover:text-[#111620]'
                  }`}>
                  Annual
                </button>
              </div>
            </div>
          </div>

          {isLoadingPlans ? (
            <LoadingSpinner smallHeight />
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 items-start">
              {plans.map((plan: SubscriptionPlan, idx: number) => {
                const isPopular = idx === 1;
                const isCurrentCycle =
                  activeSubscription?.billingCycle || 'monthly';
                const isSelectedCycle =
                  frequency === 'monthly' ? 'monthly' : 'annually';
                const isSameCycle = isCurrentCycle === isSelectedCycle;
                const isActivePlan = Boolean(
                  activeSubscription?.planId === plan.id && isSameCycle,
                );
                const isUpgradeToAnnual = Boolean(
                  activeSubscription?.planId === plan.id &&
                  isCurrentCycle === 'monthly' &&
                  isSelectedCycle === 'annually',
                );
                const price =
                  frequency === 'monthly'
                    ? Number(plan.priceMonthly)
                    : Number(plan.priceAnnually);

                let featuresObj: any = {};
                if (typeof plan.features === 'string') {
                  try {
                    featuresObj = JSON.parse(plan.features);
                  } catch {}
                } else if (plan.features && typeof plan.features === 'object') {
                  featuresObj = plan.features;
                }

                const renderedFeatures = ALL_FEATURES.map((f) => {
                  const val = featuresObj[f.key];
                  const included =
                    val === true ||
                    (typeof val === 'number' && val > 0) ||
                    val === -1;
                  let text = f.label;
                  if (f.key === 'MAX_EVENTS') {
                    if (val === -1) text = 'Unlimited Events';
                    else if (val) text = `Up to ${val} Events/month`;
                    else text = 'No Events allowed';
                  }
                  return {name: text, included};
                });

                return (
                  <div
                    key={plan.id}
                    className={`relative h-full flex flex-col rounded-sm ${
                      isActivePlan
                        ? 'bg-white shadow-sm border-2 border-green-500'
                        : isPopular
                          ? 'bg-white shadow-sm border-2 border-primary'
                          : 'bg-white shadow-xs border border-gray-200'
                    }`}>
                    {isActivePlan ? (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-sm z-10 flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Current Plan
                      </div>
                    ) : isPopular ? (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-sm z-10 shadow-sm">
                        Most Popular
                      </div>
                    ) : null}

                    <div className="p-8 flex flex-col h-full">
                      <h3 className="text-[24px] font-bold text-[#111620] mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-[#787878] text-[14px] mb-6 min-h-10">
                        Elevate your DJ career with our powerful tools.
                      </p>

                      <div className="flex items-baseline mb-8">
                        <span className="text-[#111620] flex items-center tracking-tight">
                          <span className="text-[20px] font-bold text-[#111620] mr-1.5">
                            {plan.currencyCode || selectedCurrency}
                          </span>
                          <NumberFlow
                            value={price}
                            format={{useGrouping: false}}
                            className="font-bold text-[48px]"
                          />
                        </span>
                        <span className="text-[#787878] text-[14px] ml-1 font-medium">
                          /{frequency === 'monthly' ? 'month' : 'year'}
                        </span>

                        {plan.discountPercentage ? (
                          <div className="ml-auto flex items-center">
                            <span className="bg-rose-100 text-rose-600 border border-rose-200 px-2.5 py-1 text-[11px] font-extrabold capitalize tracking-widest rounded-sm shadow-xs animate-pulse">
                              Save {plan.discountPercentage}%
                            </span>
                          </div>
                        ) : null}
                      </div>

                      {isActivePlan && canRenew ? (
                        <button
                          onClick={() => handleSubscribeClick(plan.id)}
                          disabled={isSubscribing || isPreviewing}
                          className="w-full py-3.5 rounded-sm font-bold mb-8 transition-colors duration-300 text-[15px] bg-primary hover:bg-[#d62828] text-white cursor-pointer shadow-sm flex items-center justify-center gap-2">
                          <Zap className="w-4 h-4" />
                          <span>
                            {isPreviewing && selectedPlanId === plan.id
                              ? 'Calculating...'
                              : 'Renew This Plan'}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (isActivePlan) {
                              toast.info(
                                `Your subscription is active with ${daysRemaining || 0} days remaining. Renewals open 7 days prior to expiration.`,
                              );
                              return;
                            }
                            handleSubscribeClick(plan.id);
                          }}
                          disabled={
                            isActivePlan || isSubscribing || isPreviewing
                          }
                          className={`w-full py-3.5 rounded-sm font-bold mb-8 transition-colors duration-300 text-[15px] ${
                            isActivePlan
                              ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
                              : activeSubscription
                                ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-sm'
                                : isPopular
                                  ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-sm'
                                  : 'bg-[#E5E7EB] text-[#111620] hover:bg-[#D1D5DB] cursor-pointer'
                          }`}>
                          {isActivePlan
                            ? 'Current Plan'
                            : isUpgradeToAnnual
                              ? isPreviewing && selectedPlanId === plan.id
                                ? 'Calculating...'
                                : 'Switch to Annual (Save Discount)'
                              : activeSubscription
                                ? isPreviewing && selectedPlanId === plan.id
                                  ? 'Calculating...'
                                  : 'Upgrade to this Plan'
                                : isSubscribing && selectedPlanId === plan.id
                                  ? 'Processing...'
                                  : 'Subscribe'}
                        </button>
                      )}

                      <ul className="space-y-4 grow">
                        {renderedFeatures.map((feature: any, index: number) => (
                          <li
                            key={index}
                            className={`flex items-start gap-3 ${feature.included ? '' : 'opacity-50'}`}>
                            {feature.included !== false ? (
                              <span className="bg-[#10B981]/10 text-[#10B981] p-0.5 rounded-sm mt-0.5 shrink-0">
                                <Check size={14} strokeWidth={3} />
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-500 p-0.5 rounded-sm mt-0.5 shrink-0">
                                <X size={14} strokeWidth={3} />
                              </span>
                            )}
                            <span
                              className={`text-[14px] leading-tight ${
                                feature.included !== false
                                  ? 'text-[#111620]'
                                  : 'text-[#A1A1AA]'
                              }`}>
                              {feature.name || feature}
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
        </div>

        {/* Subscription History & Activity */}
        <Card className="border border-gray-200 shadow-xs overflow-hidden rounded-sm bg-white">
          <CardContent className="p-0">
            <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-[18px] font-bold text-[#111620]">
                  Subscription History & Activity
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your plan activations, upgrades, and renewal records.
                </p>
              </div>

              <Link
                href="/dashboard/invoices"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors">
                <Receipt className="w-3.5 h-3.5 text-gray-500" />
                <span>View All Invoices</span>
                <ArrowRight className="w-3 h-3 text-gray-400" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/60 border-b border-gray-100">
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[24%]">
                      Plan Name
                    </th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[19%]">
                      Start Date
                    </th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[19%]">
                      End Date
                    </th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                      Amount Paid
                    </th>
                    <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[18%]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingInvoices ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center">
                        <LoadingSpinner smallHeight />
                      </td>
                    </tr>
                  ) : subscriptionHistory.length > 0 ? (
                    subscriptionHistory.map((item: any, index: number) => {
                      const startDate = new Date(
                        item.createdAt,
                      ).toLocaleDateString('en-GB');

                      const tx = item.transactions?.[0];
                      const txCycle =
                        (tx?.metadata as any)?.billingCycle ||
                        item.billingCycle;
                      const isAnnual =
                        txCycle === 'annually' ||
                        (item.plan?.priceAnnually &&
                          Number(item.amount) >
                            Number(item.plan?.priceMonthly || 0) * 2);

                      // Calculate or format end date
                      let endDate = '30 Days';
                      if (item.dueDate) {
                        endDate = new Date(item.dueDate).toLocaleDateString(
                          'en-GB',
                        );
                      } else if (
                        activeSubscription?.planId === item.planId &&
                        activeSubscription?.periodEnd
                      ) {
                        endDate = new Date(
                          activeSubscription.periodEnd,
                        ).toLocaleDateString('en-GB');
                      } else {
                        const durationDays = isAnnual ? 365 : 30;
                        const endMs =
                          new Date(item.createdAt).getTime() +
                          durationDays * 86400000;
                        endDate = new Date(endMs).toLocaleDateString('en-GB');
                      }

                      return (
                        <tr
                          key={item.id}
                          className={`${index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} hover:bg-gray-100/50 transition-colors border-b border-gray-100 last:border-none`}>
                          <td className="py-4 px-6 text-[14px] font-bold text-[#111620]">
                            <div className="flex items-center gap-2">
                              <span>
                                {item.plan?.name || 'Subscription Plan'}
                              </span>
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded-sm bg-gray-100 text-gray-700 border border-gray-200">
                                {isAnnual ? 'Annual' : 'Monthly'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-[14px] text-[#787878]">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#A1A1AA]" />
                              <span>{startDate}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-[14px] text-[#787878]">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="font-medium text-gray-900">
                                {endDate}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-[14px] font-mono font-bold text-[#111620]">
                            {item.currencyCode || selectedCurrency}{' '}
                            {Number(item.amount).toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-white text-[11px] font-bold uppercase tracking-wider bg-[#10B981]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              PAID
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 text-center text-gray-500 text-sm">
                        No subscription history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payment Gateway Selection & Prorated Upgrade Modal */}
        {selectedPlan && (
          <GatewaySelectionModal
            isOpen={gatewayModalOpen}
            onClose={() => setGatewayModalOpen(false)}
            onSelectGateway={handleProceedSubscription}
            onInstantUpgrade={() => handleProceedSubscription()}
            planName={selectedPlan.name}
            currentPlanName={upgradePreview?.currentPlan?.name}
            remainingDays={upgradePreview?.currentPlan?.remainingDays}
            price={
              frequency === 'monthly'
                ? Number(selectedPlan.priceMonthly)
                : Number(selectedPlan.priceAnnually)
            }
            billingCycle={frequency === 'monthly' ? 'monthly' : 'annually'}
            currency={upgradePreview?.currency || selectedCurrency}
            tenantCountry={tenantCountry}
            isLoading={isSubscribing || isPreviewing}
            isUpgrade={Boolean(upgradePreview?.isUpgrade)}
            isRenewal={Boolean(upgradePreview?.isRenewal)}
            unusedCredit={upgradePreview?.unusedCredit || 0}
            amountToPay={upgradePreview?.amountToPay}
            isDowngrade={Boolean(upgradePreview?.isDowngrade)}
            downgradeMessage={upgradePreview?.downgradeMessage}
          />
        )}
      </div>
    </div>
  );
}
