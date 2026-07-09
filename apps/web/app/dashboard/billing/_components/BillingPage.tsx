'use client';

import {useState} from 'react';
import {Zap, Check, X, Calendar, CheckCircle2, CreditCard, ExternalLink} from 'lucide-react';
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
  DialogTrigger
} from '@repo/ui';
import {
  useGetPlansQuery,
  useGetMySubscriptionQuery,
  useSubscribeMutation,
  useCancelSubscriptionMutation,
  useGetMyInvoicesQuery,
  SubscriptionPlan,
  useGetCurrentProfileQuery,
  useCheckPaystackAccountStatusQuery,
  useGetPaystackOnboardingLinkMutation,
  useGetPaystackBanksQuery,
  useDisconnectPaystackAccountMutation
} from '@repo/store';

const ALL_FEATURES = [
  { key: 'CUSTOM_SUBDOMAIN', label: 'Custom Subdomain' },
  { key: 'BASIC_PROFILE', label: 'Basic DJ Profile' },
  { key: 'MANUAL_BOOKINGS', label: 'Manual Bookings' },
  { key: 'ONLINE_PAYMENTS', label: 'Online Payments (Stripe)' },
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

import { toast } from 'sonner';

export default function BillingSubscriptionPage() {
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Fetch API data
  const { data: plansResponse, isLoading: isLoadingPlans } = useGetPlansQuery();
  const { data: subResponse, isLoading: isLoadingSub, refetch: refetchSub } = useGetMySubscriptionQuery();
  const { data: invoicesResponse, isLoading: isLoadingInvoices } = useGetMyInvoicesQuery();

  const { data: profileResponse } = useGetCurrentProfileQuery();
  const tenantId = profileResponse?.data?.tenant?.id;
  const { data: paystackStatusResponse, isLoading: isLoadingPaystack } = useCheckPaystackAccountStatusQuery(tenantId || '', { skip: !tenantId });
  const [getOnboardingLink, { isLoading: isGettingPaystackLink }] = useGetPaystackOnboardingLinkMutation();
  const [disconnectAccount, { isLoading: isDisconnecting }] = useDisconnectPaystackAccountMutation();
  const paystackStatus = paystackStatusResponse?.data;

  const [paystackDialogOpen, setPaystackDialogOpen] = useState(false);
  const [paystackDisconnectDialogOpen, setPaystackDisconnectDialogOpen] = useState(false);
  const [paystackForm, setPaystackForm] = useState({ bankCode: '', accountNumber: '', businessName: '', country: 'nigeria' });

  const { data: banksResponse, isLoading: isLoadingBanks } = useGetPaystackBanksQuery(paystackForm.country, { skip: !paystackDialogOpen });
  const banksList = banksResponse?.data || [];

  const [subscribe, { isLoading: isSubscribing }] = useSubscribeMutation();
  const [cancelSubscription, { isLoading: isCanceling }] = useCancelSubscriptionMutation();

  const plans = plansResponse?.data || [];
  const activeSubscription = subResponse?.data;
  
  // Filter only subscription invoices
  const billingHistory = (invoicesResponse?.data || []).filter(
    (inv: any) => inv.type === 'SUBSCRIPTION'
  );

  const handleSubscribe = async (planId: number) => {
    try {
      const res = await subscribe({ 
        planId: planId, 
        billingCycle: frequency === 'monthly' ? 'monthly' : 'annually',
        successUrl: window.location.origin + '/dashboard/billing?success=true',
        cancelUrl: window.location.origin + '/dashboard/billing?canceled=true'
      }).unwrap();
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to initiate subscription');
    }
  };

  const handlePaystackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;
    try {
      const res = await getOnboardingLink({
        tenantId,
        ...paystackForm
      }).unwrap();
      
      if (res.success) {
        toast.success('Successfully connected Paystack account!');
        setPaystackDialogOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to connect Paystack');
    }
  };

  const handleDisconnectPaystack = async () => {
    if (!tenantId) return;
    try {
      const res = await disconnectAccount({ tenantId }).unwrap();
      if (res.success) {
        toast.success('Successfully removed Paystack account');
        setPaystackDisconnectDialogOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to remove account');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelSubscription().unwrap();
      toast.success('Subscription cancelled successfully');
      setCancelDialogOpen(false);
      refetchSub();
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to cancel subscription');
    }
  };

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


         {/* Payouts & Payments Section */}
        <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden rounded-2xl bg-white mb-8">
          <CardContent className="p-0">
            <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-[#F5F5F5] flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6 text-[#111620]" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-[20px] font-bold text-[#111620]">
                      Payouts via Paystack
                    </h2>
                    {isLoadingPaystack ? null : paystackStatus?.isConnected ? (
                      <Badge className="bg-[#10B981] hover:bg-[#10B981] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        CONNECTED
                      </Badge>
                    ) : (
                      <Badge className="bg-[#F59E0B] hover:bg-[#F59E0B] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        NOT CONNECTED
                      </Badge>
                    )}
                  </div>
                  <p className="text-[#787878] text-[14px]">
                    {paystackStatus?.isConnected ? (
                      `Payouts are securely sent to your ${paystackStatus.bankName || 'bank'} account ending in •••• ${paystackStatus.accountNumber?.slice(-4) || '****'}.`
                    ) : (
                      "Connect your bank account to receive payments from client bookings."
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                {paystackStatus?.isConnected ? (
                  <Dialog open={paystackDisconnectDialogOpen} onOpenChange={setPaystackDisconnectDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 md:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold h-11 rounded-lg">
                        Remove Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Remove Connected Bank Account</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to remove this bank account? You will not be able to receive booking payouts until you connect a new one.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={() => setPaystackDisconnectDialogOpen(false)}>Cancel</Button>
                        <Button 
                          type="button" 
                          className="bg-red-600 hover:bg-red-700 text-white" 
                          onClick={handleDisconnectPaystack} 
                          disabled={isDisconnecting}
                        >
                          {isDisconnecting ? 'Removing...' : 'Yes, Remove Account'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Dialog open={paystackDialogOpen} onOpenChange={setPaystackDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-white font-semibold h-11 rounded-lg">
                        Connect with Paystack
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Connect Paystack Account</DialogTitle>
                        <DialogDescription>
                          Enter your bank details to receive booking payouts directly to your account.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePaystackSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Business Name</label>
                          <input 
                            required 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value={paystackForm.businessName} 
                            onChange={e => setPaystackForm({...paystackForm, businessName: e.target.value})} 
                            placeholder="Your DJ Name" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Country</label>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value={paystackForm.country}
                            onChange={e => setPaystackForm({...paystackForm, country: e.target.value, bankCode: ''})}
                          >
                            <option value="nigeria">Nigeria</option>
                            <option value="kenya">Kenya</option>
                            <option value="ghana">Ghana</option>
                            <option value="south africa">South Africa</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Bank</label>
                          <select 
                            required 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value={paystackForm.bankCode} 
                            onChange={e => setPaystackForm({...paystackForm, bankCode: e.target.value})} 
                            disabled={isLoadingBanks}
                          >
                            <option value="">{isLoadingBanks ? 'Loading banks...' : 'Select your bank'}</option>
                            {banksList.map((bank: any) => (
                              <option key={bank.id} value={bank.code}>{bank.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Account Number</label>
                          <input 
                            required 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value={paystackForm.accountNumber} 
                            onChange={e => setPaystackForm({...paystackForm, accountNumber: e.target.value})} 
                            placeholder="0000000000" 
                          />
                        </div>
                        <DialogFooter className="mt-6">
                          <Button type="button" variant="outline" onClick={() => setPaystackDialogOpen(false)}>Cancel</Button>
                          <Button type="submit" disabled={isGettingPaystackLink}>
                            {isGettingPaystackLink ? 'Connecting...' : 'Connect'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Plan & Usage Section */}
        {isLoadingSub ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : activeSubscription ? (
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
                        {activeSubscription.plan?.name || 'Active Plan'}
                      </h2>
                      <Badge className="bg-primary hover:bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {activeSubscription.status === 'active' ? 'ACTIVE' : activeSubscription.status}
                      </Badge>
                    </div>
                    <p className="text-[#787878] text-[14px]">
                      {activeSubscription.periodEnd ? `Renews on ${new Date(activeSubscription.periodEnd).toLocaleDateString('en-GB')}` : 'No renewal date'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                  <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        disabled={isCanceling}
                        className="flex-1 md:flex-none bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#111620] font-semibold h-11 rounded-lg">
                        {isCanceling ? 'Canceling...' : 'Cancel Plan'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Subscription</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                          Keep Subscription
                        </Button>
                        <Button 
                          onClick={handleCancel} 
                          disabled={isCanceling}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          {isCanceling ? 'Canceling...' : 'Yes, Cancel'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden rounded-2xl bg-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-[20px] font-bold text-[#111620] mb-2">No Active Subscription</h2>
              <p className="text-[#787878] mb-4">Choose a plan below to unlock premium features and grow your DJ business.</p>
            </CardContent>
          </Card>
        )}

        

        {/* Pricing/Available Plans Section */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-[20px] font-bold text-[#111620]">
              Available Plans
            </h2>

            {/* Toggle Monthly/Yearly */}
            <div className="bg-[#E5E7EB] p-1 rounded-lg inline-flex items-center">
              <button
                onClick={() => setFrequency('monthly')}
                className={`px-5 py-2 rounded-md text-[13px] font-bold transition-all duration-300 cursor-pointer ${
                  frequency === 'monthly'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-[#787878] hover:text-[#111620]'
                }`}>
                Monthly
              </button>
              <button
                onClick={() => setFrequency('yearly')}
                className={`px-5 py-2 rounded-md text-[13px] font-bold flex items-center gap-2 cursor-pointer transition-all duration-300 ${
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

          {isLoadingPlans ? (
            <div className="flex justify-center p-10">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 items-start">
              {plans.map((plan: SubscriptionPlan, idx: number) => {
                const isPopular = idx === 1; // Highlight the middle plan
                const isActivePlan = activeSubscription?.planId === plan.id;
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
                    className={`relative h-full flex flex-col ${
                      isActivePlan
                        ? 'bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-green-500'
                        : isPopular
                        ? 'bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-2 border-primary'
                        : 'bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] border-2 border-transparent'
                    }`}>
                    {isActivePlan ? (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full z-10 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Current Plan
                      </div>
                    ) : isPopular ? (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#10B981] text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full z-10">
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
                      </div>

                      <button
                        onClick={() => {
                          if (activeSubscription) {
                            toast.info(isActivePlan ? 'You are already subscribed to this plan.' : 'Please cancel your current plan before switching.');
                            return;
                          }
                          handleSubscribe(plan.id);
                        }}
                        disabled={isSubscribing}
                        className={`w-full py-3.5 rounded-lg font-bold mb-8 transition-colors duration-300 text-[15px] ${
                          isActivePlan
                            ? 'bg-green-50 text-green-600 border border-green-200 cursor-pointer'
                            : isPopular
                            ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
                            : 'bg-[#E5E7EB] text-[#111620] hover:bg-[#D1D5DB] cursor-pointer'
                        }`}>
                        {isActivePlan ? 'Already Active' : isSubscribing ? 'Processing...' : 'Subscribe'}
                      </button>

                      <ul className="space-y-4 grow">
                        {renderedFeatures.map((feature: any, index: number) => (
                          <li key={index} className={`flex items-start gap-3 ${feature.included ? '' : 'opacity-50'}`}>
                            {feature.included !== false ? (
                              <span className="bg-[#10B981]/10 text-[#10B981] p-0.5 rounded mt-0.5 shrink-0">
                                <Check size={14} strokeWidth={3} />
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-500 p-0.5 rounded mt-0.5 shrink-0">
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

       

        {/* Billing History Table */}
        <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden rounded-2xl bg-white">
          <CardContent className="p-0">
            <div className="p-6 md:p-8 border-b border-gray-100">
              <h2 className="text-[18px] font-bold text-[#111620]">
                Billing History
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                      Payment ID
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                      Plan
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                      Date
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                      Amount (KES)
                    </th>
                    <th className="py-5 px-8 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider w-[20%]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingInvoices ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 border-2 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                        </div>
                      </td>
                    </tr>
                  ) : billingHistory.length > 0 ? (
                    billingHistory.map((item: any, index: number) => (
                      <tr
                        key={item.id}
                        className={`${index % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} hover:bg-gray-100/50 transition-colors`}>
                        <td className="py-5 px-8 text-[14px] font-bold text-[#111620]">
                          {item.stripeInvoiceId || item.id.substring(0, 8).toUpperCase()}
                        </td>
                        <td className="py-5 px-8 text-[14px] font-semibold text-[#111620]">
                          {item.plan?.name || 'Subscription'}
                        </td>
                        <td className="py-5 px-8 text-[14px] text-[#787878]">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[#A1A1AA]" />
                            {new Date(item.createdAt).toLocaleDateString('en-GB')}
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
                                : 'bg-[#F59E0B]'
                            }`}>
                            {item.status === 'paid' && (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            {item.status}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-500">
                        No billing history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
