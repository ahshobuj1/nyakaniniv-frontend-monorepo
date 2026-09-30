/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Card, CardContent, Button } from '@repo/ui';
import {
  useGetMyWalletQuery,
  useGetCurrentProfileQuery,
  useDisconnectPaystackAccountMutation,
} from '@repo/store';
import {
  Wallet,
  Clock,
  ArrowDownToLine,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  Smartphone,
  Calendar,
  TrendingUp,
  RefreshCw,
  Info,
  ArrowUpRight,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { PaystackBrandLogo, PesapalBrandLogo } from '@/components/payment/PaymentMethodLogos';
import WithdrawModal from './WithdrawModal';
import ConnectPayoutModal from './ConnectPayoutModal';

export default function WalletPage() {
  const { data: profileResponse } = useGetCurrentProfileQuery();
  const tenant = profileResponse?.data?.tenant;
  const tenantId = tenant?.id || '';
  const tenantCountry = tenant?.country || 'kenya';
  const stageName = (profileResponse?.data as any)?.stageName || (tenant as any)?.name || 'DJ Account';

  const { data: walletResponse, isLoading: isWalletLoading, refetch } = useGetMyWalletQuery(tenantId, {
    skip: !tenantId,
  });

  const walletData = walletResponse?.data;
  const wallet = walletData?.wallet;
  const connectedAccount = walletData?.connectedAccount;
  const payoutRequests = walletData?.payoutRequests || [];
  const ledgers = walletData?.ledgers || [];

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ledgers' | 'withdrawals'>('ledgers');

  const [disconnectAccount, { isLoading: isDisconnecting }] = useDisconnectPaystackAccountMutation();

  const handleDisconnectAccount = async () => {
    if (!tenantId) return;
    try {
      await disconnectAccount({ tenantId }).unwrap();
      toast.success('Payout destination removed successfully.');
      setIsDisconnectDialogOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Failed to remove payout destination.');
    }
  };

  const currency = wallet?.currency || 'KES';
  const availableBalance = wallet?.availableBalance || 0;
  const pendingBalance = wallet?.pendingBalance || 0;
  const totalEarnings = wallet?.totalEarnings || 0;
  const totalWithdrawn = wallet?.totalWithdrawn || 0;

  const isMobile = connectedAccount?.gateway === 'PESAPAL';

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen p-4 md:p-6 font-sans">
      <div className="mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-[28px] font-bold tracking-tight text-[#111620]">
              Wallet & Payouts
            </h1>
            <p className="text-[#787878] text-[15px]">
              Manage your DJ earnings, escrow balances, and bank/mobile money payouts.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => refetch()}
              className="flex items-center justify-center gap-2 px-4 h-11 rounded-xl bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#111620] text-sm font-semibold transition-all shadow-xs cursor-pointer shrink-0"
            >
              <RefreshCw className="w-4 h-4 text-[#787878]" />
              <span className="hidden sm:inline">Sync Balance</span>
            </button>
            <Button
              type="button"
              onClick={() => {
                if (!connectedAccount) {
                  setConnectModalOpen(true);
                } else {
                  setWithdrawModalOpen(true);
                }
              }}
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white font-bold h-11 px-5 rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Withdraw Funds</span>
            </Button>
          </div>
        </div>

        {/* Escrow Financial Protection Banner */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-[15px] font-bold text-[#111620]">
                  Escrow Financial Protection & Instant Payouts
                </h4>
                <span className="text-[11px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md">
                  2% Platform Fee Model
                </span>
              </div>
              <p className="text-[13px] text-[#787878] mt-0.5">
                Client payments are held securely in Escrow until gig completion. Net earnings are unlocked into your Available Balance for immediate transfer.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#787878] bg-[#F9FAFB] border border-[#E5E7EB] px-3 py-1.5 rounded-lg shrink-0">
            <Info className="w-3.5 h-3.5 text-primary" />
            <span>Automated settlement upon booking completion</span>
          </div>
        </div>

        {/* 4 Financial Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {/* Card 1: Available for Payout */}
          <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] rounded-2xl bg-white overflow-hidden p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Available
                </span>
              </div>
              <p className="text-[12px] font-semibold text-[#787878] uppercase tracking-wider mb-1">
                Available for Payout
              </p>
              <h3 className="text-[26px] md:text-[28px] font-extrabold text-[#111620] tracking-tight">
                {currency} {availableBalance.toLocaleString()}
              </h3>
            </div>
            <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
              <span className="text-xs text-[#787878]">Ready for transfer</span>
              <button
                type="button"
                onClick={() => {
                  if (!connectedAccount) setConnectModalOpen(true);
                  else setWithdrawModalOpen(true);
                }}
                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Withdraw <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>

          {/* Card 2: In Escrow (Pending) */}
          <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] rounded-2xl bg-white overflow-hidden p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Escrow
                </span>
              </div>
              <p className="text-[12px] font-semibold text-[#787878] uppercase tracking-wider mb-1">
                In Escrow (Pending)
              </p>
              <h3 className="text-[26px] md:text-[28px] font-extrabold text-[#111620] tracking-tight">
                {currency} {pendingBalance.toLocaleString()}
              </h3>
            </div>
            <div className="pt-4 border-t border-gray-100 mt-4">
              <p className="text-xs text-[#787878]">Releases upon event completion</p>
            </div>
          </Card>

          {/* Card 3: Total DJ Earnings */}
          <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] rounded-2xl bg-white overflow-hidden p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Net
                </span>
              </div>
              <p className="text-[12px] font-semibold text-[#787878] uppercase tracking-wider mb-1">
                Total DJ Net Earnings
              </p>
              <h3 className="text-[26px] md:text-[28px] font-extrabold text-[#111620] tracking-tight">
                {currency} {totalEarnings.toLocaleString()}
              </h3>
            </div>
            <div className="pt-4 border-t border-gray-100 mt-4">
              <p className="text-xs text-[#787878]">After 2% platform fee & deductions</p>
            </div>
          </Card>

          {/* Card 4: Total Transferred */}
          <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] rounded-2xl bg-white overflow-hidden p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                  <ArrowDownToLine className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Paid
                </span>
              </div>
              <p className="text-[12px] font-semibold text-[#787878] uppercase tracking-wider mb-1">
                Total Transferred
              </p>
              <h3 className="text-[26px] md:text-[28px] font-extrabold text-[#111620] tracking-tight">
                {currency} {totalWithdrawn.toLocaleString()}
              </h3>
            </div>
            <div className="pt-4 border-t border-gray-100 mt-4">
              <p className="text-xs text-[#787878]">Successfully paid out to destination</p>
            </div>
          </Card>
        </div>

        {/* Connected Payout Destination Card */}
        <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] rounded-2xl bg-white overflow-hidden p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start md:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F5F5F5] border border-gray-100 flex items-center justify-center text-[#111620] shrink-0">
                {connectedAccount ? (
                  isMobile ? <Smartphone className="w-7 h-7 text-primary" /> : <Building2 className="w-7 h-7 text-primary" />
                ) : (
                  <Building2 className="w-7 h-7 text-[#A1A1AA]" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-[18px] font-bold text-[#111620]">
                    Payout Destination
                  </h3>
                  {connectedAccount ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      {connectedAccount.gateway === 'PESAPAL' ? (
                        <PesapalBrandLogo />
                      ) : (
                        <PaystackBrandLogo />
                      )}
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Active & Verified
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Not Connected
                    </span>
                  )}
                </div>
                {connectedAccount ? (
                  <div className="flex items-center gap-3 text-sm text-[#787878] flex-wrap">
                    <span className="font-semibold text-[#111620]">
                      {connectedAccount.accountName || (connectedAccount as any).metadata?.accountName || 'Connected Account'}
                    </span>
                    <span>•</span>
                    <span className="text-[#111620] font-medium">{connectedAccount.bankName || (connectedAccount as any).metadata?.bankName || 'Settlement Bank'}</span>
                    <span>•</span>
                    <span className="font-mono font-medium">•••• {connectedAccount.accountId?.slice(-4) || '****'}</span>
                    <span>•</span>
                    <span className="uppercase text-xs font-bold text-gray-500">
                      {(connectedAccount as any).currencyCode || currency} ({(connectedAccount as any).countryCode || 'KE'})
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-[#787878]">
                    Connect your Bank Account or Mobile Money wallet to receive automatic booking settlements and payouts directly.
                  </p>
                )}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2.5">
              {connectedAccount ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDisconnectDialogOpen(true)}
                    className="h-11 px-4 rounded-xl font-bold text-xs text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Destination</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setConnectModalOpen(true)}
                    className="h-11 px-5 rounded-xl font-bold text-xs bg-[#111620] hover:bg-black text-white cursor-pointer transition-all shadow-xs"
                  >
                    Change Destination
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setConnectModalOpen(true)}
                  className="h-11 px-5 rounded-xl font-bold text-sm bg-primary hover:bg-primary/90 text-white shadow-sm cursor-pointer transition-all"
                >
                  Connect Payout Account
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Filters / Tabs (matching Bookings & Invoices) */}
        <div className="flex items-center gap-3 pt-2 pb-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('ledgers')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all border cursor-pointer ${
              activeTab === 'ledgers'
                ? 'border-primary text-primary bg-white shadow-xs'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}
          >
            Audit Ledger & Transactions
            <span
              className={`flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] rounded-full text-white ${
                activeTab === 'ledgers' ? 'bg-primary' : 'bg-[#D1D5DB]'
              }`}
            >
              {ledgers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('withdrawals')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all border cursor-pointer ${
              activeTab === 'withdrawals'
                ? 'border-primary text-primary bg-white shadow-xs'
                : 'border-transparent bg-white text-[#787878] hover:bg-gray-50'
            }`}
          >
            Payout Transfers
            <span
              className={`flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] rounded-full text-white ${
                activeTab === 'withdrawals' ? 'bg-primary' : 'bg-[#D1D5DB]'
              }`}
            >
              {payoutRequests.length}
            </span>
          </button>
        </div>

        {/* Tables Section */}
        {activeTab === 'ledgers' ? (
          <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden rounded-2xl bg-white">
            <CardContent className="p-0">
              <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-bold text-[#111620]">
                    Double-Entry Audit Ledger
                  </h2>
                  <p className="text-xs text-[#787878] mt-0.5">
                    Immutable financial ledger of all customer deposits, 2% platform deductions, and balance movements.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAFAFA] border-b border-gray-100">
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Transaction Type
                      </th>
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Booking / Ref
                      </th>
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Amount ({currency})
                      </th>
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Net Balance After
                      </th>
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isWalletLoading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="flex justify-center">
                            <div className="w-6 h-6 border-2 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                          </div>
                        </td>
                      </tr>
                    ) : ledgers.length > 0 ? (
                      ledgers.map((l: any, idx: number) => {
                        const isCredit = l.type === 'ESCROW_CREDIT' || l.type === 'ESCROW_RELEASE' || l.type === 'TRANSFER_FAILED_REVERSAL';
                        const isDebit = l.type === 'WITHDRAWAL' || l.type === 'PLATFORM_FEE' || l.type === 'GATEWAY_FEE' || l.type === 'REFUND';

                        return (
                          <tr
                            key={l.id || idx}
                            className={`${idx % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} hover:bg-gray-100/60 transition-colors border-b border-gray-50`}
                          >
                            <td className="py-4 px-6 text-sm text-[#787878]">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-[#A1A1AA]" />
                                <span>{new Date(l.createdAt).toLocaleDateString('en-GB')}</span>
                                <span className="text-xs text-gray-400">
                                  {new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-sm font-bold text-[#111620]">
                                {l.type.replace(/_/g, ' ')}
                              </span>
                              {l.description && (
                                <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded-md text-[12px] text-amber-800 font-medium leading-snug">
                                  {l.description}
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-6 text-sm text-[#787878] font-mono">
                              {l.referenceId || l.paymentId?.substring(0, 10) || l.transferId?.substring(0, 10) || '—'}
                            </td>
                            <td className="py-4 px-6 text-sm font-bold">
                              <span className={isCredit ? 'text-emerald-600' : isDebit ? 'text-red-600' : 'text-[#111620]'}>
                                {isCredit ? '+' : isDebit ? '-' : ''}
                                {currency} {Number(l.amount).toLocaleString()}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm font-semibold text-[#111620]">
                              {currency} {Number(l.newBalance ?? l.balanceAfter ?? 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                                {l.status || 'COMPLETED'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-sm text-[#787878]">
                          No ledger records found. When customers pay for bookings, your earnings will appear here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden rounded-2xl bg-white">
            <CardContent className="p-0">
              <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-bold text-[#111620]">
                    Payout Transfer Requests
                  </h2>
                  <p className="text-xs text-[#787878] mt-0.5">
                    History of all withdrawals sent to your bank or mobile money.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAFAFA] border-b border-gray-100">
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Transfer Ref
                      </th>
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Destination
                      </th>
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Amount ({currency})
                      </th>
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Fee
                      </th>
                      <th className="py-4 px-6 text-[12px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isWalletLoading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="flex justify-center">
                            <div className="w-6 h-6 border-2 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                          </div>
                        </td>
                      </tr>
                    ) : payoutRequests.length > 0 ? (
                      payoutRequests.map((p: any, idx: number) => {
                        const isSuccess = p.status === 'SUCCESS' || p.status === 'COMPLETED' || p.status === 'PAID';
                        const isPending = p.status === 'PENDING' || p.status === 'PROCESSING';

                        return (
                          <tr
                            key={p.id || idx}
                            className={`${idx % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} hover:bg-gray-100/60 transition-colors border-b border-gray-50`}
                          >
                            <td className="py-4 px-6 text-sm font-bold font-mono text-[#111620]">
                              {p.transferReference || p.id?.substring(0, 10).toUpperCase() || '—'}
                            </td>
                            <td className="py-4 px-6 text-sm font-semibold text-[#111620]">
                              {p.gateway === 'PESAPAL' ? 'Mobile Money (M-Pesa)' : 'Bank Transfer (Paystack)'}
                            </td>
                            <td className="py-4 px-6 text-sm text-[#787878]">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-[#A1A1AA]" />
                                <span>{new Date(p.createdAt).toLocaleDateString('en-GB')}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm font-bold text-[#111620]">
                              {currency} {Number(p.amount).toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-sm text-[#787878]">
                              {p.fee ? `${currency} ${Number(p.fee).toLocaleString()}` : 'Free'}
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                  isSuccess
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : isPending
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-sm text-[#787878]">
                          No withdrawal requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        tenantId={tenantId}
        availableBalance={availableBalance}
        currency={currency}
        connectedAccount={connectedAccount}
        onSuccess={() => refetch()}
      />

      {/* Connect Payout Modal */}
      <ConnectPayoutModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        tenantId={tenantId}
        defaultCountry={tenantCountry}
        defaultStageName={stageName}
        isConnected={Boolean(connectedAccount)}
        onDisconnect={() => setIsDisconnectDialogOpen(true)}
        onSuccess={() => refetch()}
      />

      {/* Disconnect Payout Destination Confirmation */}
      <ConfirmationDialog
        isOpen={isDisconnectDialogOpen}
        onCancel={() => setIsDisconnectDialogOpen(false)}
        onConfirm={handleDisconnectAccount}
        title="Disconnect Payout Destination"
        description={`Are you sure you want to remove your connected payout destination (${connectedAccount?.bankName || 'Payout Destination'} •••• ${connectedAccount?.accountId?.slice(-4) || '****'})? You will not receive automated booking settlements or be able to initiate withdrawals until a new destination is connected.`}
        confirmText="Remove Destination"
        cancelText="Keep Destination"
        isDestructive={true}
        isLoading={isDisconnecting}
        confirmButtonClassName="bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
      />
    </div>
  );
}
