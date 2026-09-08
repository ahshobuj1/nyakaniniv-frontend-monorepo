'use client';

import React, { useState } from 'react';
import { Card, CardContent, Button, Badge } from '@repo/ui';
import { useGetMyWalletQuery } from '@repo/store';
import {
  Wallet,
  Clock,
  ArrowDownToLine,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Building2,
  Smartphone,
  Calendar,
  Layers,
  TrendingUp,
  Receipt,
  RefreshCw,
  Info,
} from 'lucide-react';
import WithdrawModal from './WithdrawModal';
import ConnectPayoutModal from './ConnectPayoutModal';

interface WalletSectionProps {
  tenantId: string;
  defaultCountry?: string;
  defaultStageName?: string;
}

export default function WalletSection({
  tenantId,
  defaultCountry = 'kenya',
  defaultStageName = '',
}: WalletSectionProps) {
  const { data: walletResponse, isLoading, refetch } = useGetMyWalletQuery(tenantId, { skip: !tenantId });
  const walletData = walletResponse?.data;
  const wallet = walletData?.wallet;
  const connectedAccount = walletData?.connectedAccount;
  const payoutRequests = walletData?.payoutRequests || [];
  const ledgers = walletData?.ledgers || [];

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'withdrawals' | 'ledgers'>('ledgers');

  const currency = wallet?.currency || 'KES';
  const availableBalance = wallet?.availableBalance || 0;
  const pendingBalance = wallet?.pendingBalance || 0;
  const totalEarnings = wallet?.totalEarnings || 0;
  const totalWithdrawn = wallet?.totalWithdrawn || 0;

  return (
    <div className="space-y-6 mb-8 font-sans">
      {/* Platform Escrow Notice Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              UpBeat Africa Escrow & Financial Protection
              <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                2% Platform Fee Model
              </span>
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Client payments are held safely in Escrow until gig completion. Net earnings are unlocked to your Available Balance for instant withdrawal.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium shrink-0 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Balance</span>
        </button>
      </div>

      {/* 4 Core Wallet Financial Balances (Spec #3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available Balance */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#101724] to-[#142334] border border-emerald-500/20 p-5 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-300 uppercase">Available</span>
              </div>
            </div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Available for Payout
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono mt-1">
              {currency} {availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10">
            <Button
              type="button"
              onClick={() => {
                if (!connectedAccount) {
                  setConnectModalOpen(true);
                } else {
                  setWithdrawModalOpen(true);
                }
              }}
              disabled={isLoading || availableBalance <= 0}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 text-xs disabled:opacity-40"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Withdraw Funds</span>
            </Button>
          </div>
        </div>

        {/* Card 2: In Escrow (Pending Clearance) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#121124] to-[#1E1638] border border-purple-500/20 p-5 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div className="bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
                <span className="text-[10px] font-bold text-purple-300 uppercase">Locked</span>
              </div>
            </div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              In Escrow (Pending)
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-200 tracking-tight font-mono mt-1">
              {currency} {pendingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-gray-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Unlocks on gig completion</span>
          </div>
        </div>

        {/* Card 3: Total Confirmed Earnings */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#101A28] to-[#12273D] border border-blue-500/20 p-5 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/30">
                <span className="text-[10px] font-bold text-blue-300 uppercase">All Time</span>
              </div>
            </div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Total DJ Earnings
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-200 tracking-tight font-mono mt-1">
              {currency} {totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-gray-400">
            <span>Net of 2% platform fee & gateway fee</span>
          </div>
        </div>

        {/* Card 4: Total Withdrawn */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#151922] to-[#1D222D] border border-white/10 p-5 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
              <div className="bg-white/10 px-2 py-0.5 rounded-full">
                <span className="text-[10px] font-bold text-gray-300 uppercase">Payouts</span>
              </div>
            </div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Total Transferred
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono mt-1">
              {currency} {totalWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-gray-400 flex justify-between items-center">
            <span>Destination:</span>
            <span className="font-semibold text-gray-300">
              {connectedAccount?.gateway || 'Bank / MoMo'}
            </span>
          </div>
        </div>
      </div>

      {/* Connected Payout Destination Account Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1420] border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#0BA4DB]/20 text-[#0BA4DB] flex items-center justify-center shrink-0">
            {connectedAccount?.gateway === 'PESAPAL' ? (
              <Smartphone className="w-5 h-5" />
            ) : (
              <Building2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">
                {connectedAccount ? connectedAccount.bankName : 'No Payout Destination Connected'}
              </h4>
              {connectedAccount ? (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold uppercase">
                  Connected & Verified
                </span>
              ) : (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold uppercase">
                  Action Required
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              {connectedAccount
                ? `Account: ${connectedAccount.accountId} ${connectedAccount.accountName ? `• ${connectedAccount.accountName}` : ''}`
                : 'Connect your Bank Account or Mobile Money wallet to receive payout withdrawals.'}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setConnectModalOpen(true)}
          className="border-white/20 text-xs text-gray-200 hover:text-white hover:bg-white/10 rounded-xl h-9 px-4 shrink-0"
        >
          {connectedAccount ? 'Update Payout Details' : 'Connect Account'}
        </Button>
      </div>

      {/* Activity Tabs: Escrow & Double-Entry Ledger vs Payout Transfers */}
      <Card className="border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.03)] overflow-hidden rounded-2xl bg-white">
        <CardContent className="p-0">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('ledgers')}
                className={`text-sm font-bold pb-2 transition-all border-b-2 cursor-pointer ${
                  activeTab === 'ledgers'
                    ? 'border-[#0BA4DB] text-[#111620]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Financial Audit Ledger ({ledgers.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('withdrawals')}
                className={`text-sm font-bold pb-2 transition-all border-b-2 cursor-pointer ${
                  activeTab === 'withdrawals'
                    ? 'border-[#0BA4DB] text-[#111620]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Payout Transfers ({payoutRequests.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'ledgers' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FAFAFA]">
                    <th className="py-3.5 px-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date & Ref</th>
                    <th className="py-3.5 px-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Transaction Activity</th>
                    <th className="py-3.5 px-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Ledger Type</th>
                    <th className="py-3.5 px-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Previous</th>
                    <th className="py-3.5 px-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">New Balance</th>
                    <th className="py-3.5 px-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Net Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ledgers.length > 0 ? (
                    ledgers.map((l) => {
                      const isNegative = l.type === 'WITHDRAWAL_REQUESTED' || l.type === 'REFUND_ADJUSTMENT';
                      return (
                        <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3.5 px-5">
                            <p className="text-xs text-gray-800 font-medium">
                              {new Date(l.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {l.referenceId ? `#${l.referenceId.substring(0, 16)}` : `#${l.id.substring(0, 8)}`}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-xs text-gray-800 font-medium max-w-xs">
                            {l.description}
                          </td>
                          <td className="py-3.5 px-5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                l.type === 'ESCROW_RELEASED'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : l.type === 'BOOKING_CREDIT_PENDING'
                                  ? 'bg-purple-100 text-purple-700'
                                  : l.type === 'WITHDRAWAL_FAILED_REVERSAL'
                                  ? 'bg-amber-100 text-amber-700'
                                  : l.type === 'REFUND_ADJUSTMENT'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {l.type === 'BOOKING_CREDIT_PENDING'
                                ? 'In Escrow'
                                : l.type === 'ESCROW_RELEASED'
                                ? 'Unlocked'
                                : l.type === 'WITHDRAWAL_FAILED_REVERSAL'
                                ? 'Restored'
                                : l.type === 'REFUND_ADJUSTMENT'
                                ? 'Refund'
                                : 'Withdrawal'}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-xs font-mono text-gray-500">
                            {l.currency} {(l.previousBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-5 text-xs font-mono font-semibold text-gray-700">
                            {l.currency} {(l.newBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className={`py-3.5 px-5 text-xs font-mono font-bold ${isNegative ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {isNegative ? '-' : '+'}
                            {l.currency} {l.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-gray-400">
                        No ledger transactions recorded yet. Booking earnings and escrow movements will appear here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FAFAFA]">
                    <th className="py-3.5 px-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Transfer Ref</th>
                    <th className="py-3.5 px-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="py-3.5 px-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Destination</th>
                    <th className="py-3.5 px-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="py-3.5 px-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Transfer Fee</th>
                    <th className="py-3.5 px-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payoutRequests.length > 0 ? (
                    payoutRequests.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3.5 px-5">
                          <p className="text-xs font-mono font-bold text-[#111620]">
                            {item.transferReference || `#${item.id.substring(0, 8).toUpperCase()}`}
                          </p>
                          <span className="text-[10px] text-gray-400">Via {item.gateway} Payout</span>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-gray-600">
                          {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3.5 px-5 text-xs text-gray-700">
                          {item.accountDetails?.bankName || item.gateway} • {item.accountDetails?.accountId || ''}
                        </td>
                        <td className="py-3.5 px-5 text-xs font-mono font-bold text-[#111620]">
                          {item.currency} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-5 text-xs font-mono text-gray-500">
                          {item.currency} {(item.fee || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-5">
                          {item.status === 'FAILED' ? (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-100 text-rose-700">
                                Failed (Restored)
                              </span>
                              <p className="text-[10px] text-gray-400">Available balance restored</p>
                            </div>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                item.status === 'SUCCEEDED' || item.status === 'COMPLETED'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : item.status === 'PROCESSING'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {item.status === 'SUCCEEDED' || item.status === 'COMPLETED'
                                ? 'Succeeded'
                                : item.status === 'PROCESSING'
                                ? 'Processing'
                                : 'Pending'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-gray-400">
                        No withdrawal requests yet. Payout transfers to your bank or mobile money will appear here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {tenantId && (
        <>
          <WithdrawModal
            isOpen={withdrawModalOpen}
            onClose={() => setWithdrawModalOpen(false)}
            tenantId={tenantId}
            availableBalance={availableBalance}
            currency={currency}
            connectedAccount={connectedAccount}
            onSuccess={() => refetch()}
          />
          <ConnectPayoutModal
            isOpen={connectModalOpen}
            onClose={() => setConnectModalOpen(false)}
            tenantId={tenantId}
            defaultCountry={defaultCountry}
            defaultStageName={defaultStageName}
            onSuccess={() => refetch()}
          />
        </>
      )}
    </div>
  );
}
