/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {useState} from 'react';
import Link from 'next/link';

import {
  Zap,
  Check,
  X,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Receipt,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  Badge,
  NumberFlow,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui';
import {
  useGetPlansQuery,
  useGetMySubscriptionQuery,
  useSubscribeMutation,
  useCancelSubscriptionMutation,
  useGetMyInvoicesQuery,
  SubscriptionPlan,
  useGetCurrentProfileQuery,
  useLazyPreviewUpgradeQuery,
  UpgradePreviewResponse,
} from '@repo/store';
import GatewaySelectionModal from './GatewaySelectionModal';
import LoadingSpinner from '@/components/LoadingSpinner';

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
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Fetch API data
  const {data: plansResponse, isLoading: isLoadingPlans} = useGetPlansQuery();
  const {
    data: subResponse,
    isLoading: isLoadingSub,
    refetch: refetchSub,
  } = useGetMySubscriptionQuery();
  const {data: invoicesResponse, isLoading: isLoadingInvoices} =
    useGetMyInvoicesQuery();

  const {data: profileResponse} = useGetCurrentProfileQuery();
  const tenantCountry = (profileResponse?.data?.tenant?.country || '')
    .trim()
    .toLowerCase();

  const [subscribe, {isLoading: isSubscribing}] = useSubscribeMutation();
  const [cancelSubscription, {isLoading: isCanceling}] =
    useCancelSubscriptionMutation();

  const [triggerPreview, {isFetching: isPreviewing}] =
    useLazyPreviewUpgradeQuery();
  const [upgradePreview, setUpgradePreview] =
    useState<UpgradePreviewResponse | null>(null);

  const plans = plansResponse?.data || [];
  const activeSubscription = subResponse?.data;

  // Filter only PAID subscription purchases for subscription history
  const rawInvoices = Array.isArray(invoicesResponse?.data)
    ? invoicesResponse.data
    : (invoicesResponse as any)?.data?.data || [];
  const subscriptionHistory = rawInvoices.filter(
    (inv: any) =>
      inv.type === 'SUBSCRIPTION' &&
      inv.status?.toLowerCase() === 'paid',
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
        window.location.href = result.data.url;
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

  const handleCancel = async () => {
    try {
      await cancelSubscription().unwrap();
      toast.success('Subscription cancelled successfully');
      setCancelDialogOpen(false);
      refetchSub();
    } catch (error: any) {
      toast.error(
        error?.data?.error?.message ||
          error?.data?.message ||
          'Failed to cancel subscription',
      );
    }
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
            Manage your plan, upgrade anytime with prorated credit, and review invoices.
          </p>
        </div>

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
                      <Badge className="bg-primary hover:bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
                        {activeSubscription.status === 'active'
                          ? 'ACTIVE'
                          : activeSubscription.status}
                      </Badge>
                    </div>
                    <p className="text-[#787878] text-[14px]">
                      {activeSubscription.periodEnd
                        ? `Valid until ${new Date(activeSubscription.periodEnd).toLocaleDateString('en-GB')}`
                        : 'Prepaid Active'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                  <Dialog
                    open={cancelDialogOpen}
                    onOpenChange={setCancelDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        disabled={isCanceling}
                        className="flex-1 md:flex-none bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#111620] font-semibold h-10 rounded-sm cursor-pointer">
                        {isCanceling ? 'Canceling...' : 'Cancel Plan'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-sm">
                      <DialogHeader>
                        <DialogTitle>Cancel Subscription</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to cancel your subscription? Your
                          public DJ profile and booking links will go offline immediately.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4 gap-2">
                        <Button
                          variant="outline"
                          className="rounded-sm"
                          onClick={() => setCancelDialogOpen(false)}>
                          Keep Subscription
                        </Button>
                        <Button
                          onClick={handleCancel}
                          disabled={isCanceling}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-sm cursor-pointer">
                          {isCanceling ? 'Canceling...' : 'Yes, Cancel Plan'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                    Your DJ portfolio website is currently offline. Choose a plan
                    below to publish your portfolio.
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
                Upgrade anytime. Unused days on your current plan will be credited automatically.
              </p>
            </div>

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

          {isLoadingPlans ? (
            <LoadingSpinner smallHeight />
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 items-start">
              {plans.map((plan: SubscriptionPlan, idx: number) => {
                const isPopular = idx === 1;
                const isActivePlan = activeSubscription?.planId === plan.id;
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
                          KES
                          <NumberFlow
                            value={price}
                            format={{useGrouping: false}}
                            className="font-bold text-[48px] ml-1"
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

                      <button
                        onClick={() => {
                          if (isActivePlan) {
                            toast.info('You are already subscribed to this plan.');
                            return;
                          }
                          handleSubscribeClick(plan.id);
                        }}
                        disabled={isSubscribing || isPreviewing}
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
                          : activeSubscription
                            ? isPreviewing && selectedPlanId === plan.id
                              ? 'Calculating...'
                              : 'Upgrade to this Plan'
                            : isSubscribing && selectedPlanId === plan.id
                              ? 'Processing...'
                              : 'Subscribe'}
                      </button>

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
                      const startDate = new Date(item.createdAt).toLocaleDateString('en-GB');

                      // Calculate or format end date
                      let endDate = '30 Days';
                      if (item.dueDate) {
                        endDate = new Date(item.dueDate).toLocaleDateString('en-GB');
                      } else if (activeSubscription?.planId === item.planId && activeSubscription?.periodEnd) {
                        endDate = new Date(activeSubscription.periodEnd).toLocaleDateString('en-GB');
                      } else {
                        const isAnnual = Number(item.amount) >= Number(item.plan?.priceAnnually || 999999);
                        const endMs = new Date(item.createdAt).getTime() + (isAnnual ? 365 : 30) * 86400000;
                        endDate = new Date(endMs).toLocaleDateString('en-GB');
                      }

                      return (
                        <tr
                          key={item.id}
                          className={`${index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} hover:bg-gray-100/50 transition-colors border-b border-gray-100 last:border-none`}>
                          <td className="py-4 px-6 text-[14px] font-bold text-[#111620]">
                            {item.plan?.name || 'Subscription Plan'}
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
                              <span className="font-medium text-gray-900">{endDate}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-[14px] font-mono font-bold text-[#111620]">
                            {item.currencyCode || 'KES'}{' '}
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
            currency={upgradePreview?.currency || 'KES'}
            tenantCountry={tenantCountry}
            isLoading={isSubscribing || isPreviewing}
            isUpgrade={Boolean(upgradePreview?.isUpgrade)}
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
