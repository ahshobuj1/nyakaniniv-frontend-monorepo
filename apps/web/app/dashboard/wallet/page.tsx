/* eslint-disable */
'use client';

import React, { useState, useMemo } from 'react';
import { Button, PaginationControls } from '@repo/ui';
import { useGetMyWalletQuery, useGetCurrentProfileQuery } from '@repo/store';
import {
  Wallet,
  Clock,
  ArrowDownToLine,
  AlertCircle,
  Building2,
  Smartphone,
  TrendingUp,
  RefreshCw,
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  RotateCcw,
  CreditCard,
  BadgeCheck,
} from 'lucide-react';
import WithdrawModal from './_components/WithdrawModal';
import ConnectPayoutModal from './_components/ConnectPayoutModal';

/* ─── Helper: Human readable ledger type ────────────────────────────── */
const LEDGER_LABELS: Record<string, { label: string; color: 'green' | 'red' | 'amber' | 'blue' | 'slate' }> = {
  BOOKING_CREDIT_PENDING: { label: 'Escrow Credit', color: 'green' },
  ESCROW_RELEASED: { label: 'Escrow Released', color: 'blue' },
  WITHDRAWAL_REQUESTED: { label: 'Withdrawal', color: 'red' },
  WITHDRAWAL_COMPLETED: { label: 'Payout Complete', color: 'green' },
  WITHDRAWAL_REJECTED: { label: 'Withdrawal Rejected', color: 'amber' },
  WITHDRAWAL_FAILED_REVERSAL: { label: 'Funds Restored', color: 'green' },
  REFUND_ADJUSTMENT: { label: 'Refund', color: 'red' },
};

const CREDIT_TYPES = new Set([
  'BOOKING_CREDIT_PENDING',
  'ESCROW_RELEASED',
  'WITHDRAWAL_FAILED_REVERSAL',
  'WITHDRAWAL_REJECTED',
]);

const DEBIT_TYPES = new Set([
  'WITHDRAWAL_REQUESTED',
  'WITHDRAWAL_COMPLETED',
  'REFUND_ADJUSTMENT',
]);

/* ─── Helper: Payout status badge ───────────────────────────────────── */
const STATUS_STYLES: Record<string, string> = {
  SUCCESS: 'bg-emerald-50 text-emerald-700',
  COMPLETED: 'bg-emerald-50 text-emerald-700',
  PAID: 'bg-emerald-50 text-emerald-700',
  PENDING: 'bg-amber-50 text-amber-700',
  PROCESSING: 'bg-amber-50 text-amber-700',
  FAILED: 'bg-red-50 text-red-700',
  REJECTED: 'bg-red-50 text-red-700',
  CONFIRMED: 'bg-emerald-50 text-emerald-700',
  RESTORED: 'bg-blue-50 text-blue-700',
};

/* ─── Helper: Gateway label ─────────────────────────────────────────── */
function gatewayLabel(gateway?: string) {
  switch (gateway) {
    case 'PAYSTACK': return 'Paystack';
    case 'FLUTTERWAVE': return 'Flutterwave';
    case 'PESAPAL': return 'Pesapal';
    default: return gateway || 'Bank Transfer';
  }
}

/* ─── Skeleton Loader ───────────────────────────────────────────────── */
function BalanceCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 animate-pulse">
      <div className="flex justify-between items-start mb-5">
        <div className="w-10 h-10 rounded-sm bg-gray-100" />
        <div className="w-16 h-5 rounded-full bg-gray-100" />
      </div>
      <div className="w-24 h-3 rounded bg-gray-100 mb-2.5" />
      <div className="w-36 h-8 rounded bg-gray-100" />
    </div>
  );
}

function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="py-4 px-6"><div className="w-20 h-4 rounded bg-gray-100" /></td>
          <td className="py-4 px-6"><div className="w-28 h-4 rounded bg-gray-100" /></td>
          <td className="py-4 px-6"><div className="w-32 h-4 rounded bg-gray-100" /></td>
          <td className="py-4 px-6"><div className="w-20 h-4 rounded bg-gray-100" /></td>
          <td className="py-4 px-6"><div className="w-16 h-4 rounded bg-gray-100" /></td>
          <td className="py-4 px-6"><div className="w-20 h-5 rounded-full bg-gray-100" /></td>
        </tr>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════════════════════════════ */
export default function WalletDashboardPage() {
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
  const [activeTab, setActiveTab] = useState<'ledgers' | 'withdrawals'>('ledgers');

  /* ─── Pagination states ───────────────────────────────────────────── */
  const [ledgerPagination, setLedgerPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const totalLedgerRows = ledgers.length;
  const totalLedgerPages = Math.max(1, Math.ceil(totalLedgerRows / ledgerPagination.pageSize));
  const paginatedLedgers = useMemo(() => {
    const start = ledgerPagination.pageIndex * ledgerPagination.pageSize;
    return ledgers.slice(start, start + ledgerPagination.pageSize);
  }, [ledgers, ledgerPagination.pageIndex, ledgerPagination.pageSize]);

  const [payoutPagination, setPayoutPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const totalPayoutRows = payoutRequests.length;
  const totalPayoutPages = Math.max(1, Math.ceil(totalPayoutRows / payoutPagination.pageSize));
  const paginatedPayouts = useMemo(() => {
    const start = payoutPagination.pageIndex * payoutPagination.pageSize;
    return payoutRequests.slice(start, start + payoutPagination.pageSize);
  }, [payoutRequests, payoutPagination.pageIndex, payoutPagination.pageSize]);

  const balancesByCurrency = walletData?.balancesByCurrency || {};
  const currency = wallet?.currency || 'KES';
  const dynamicBalance = balancesByCurrency[currency] || {};

  const availableBalance = dynamicBalance.availableBalance !== undefined ? dynamicBalance.availableBalance : (wallet?.availableBalance || 0);
  const pendingBalance = dynamicBalance.pendingBalance !== undefined ? dynamicBalance.pendingBalance : (wallet?.pendingBalance || 0);
  const totalEarnings = dynamicBalance.totalEarnings !== undefined ? dynamicBalance.totalEarnings : (wallet?.totalEarnings || 0);
  const totalWithdrawn = dynamicBalance.totalWithdrawn !== undefined ? dynamicBalance.totalWithdrawn : (wallet?.totalWithdrawn || 0);

  const isMobile = connectedAccount?.gateway === 'PESAPAL';

  const handleWithdraw = () => {
    if (!connectedAccount) {
      setConnectModalOpen(true);
    } else {
      setWithdrawModalOpen(true);
    }
  };

  /* ─── Format helpers ─────────────────────────────────────────────── */
  const fmt = (n: number) => {
    const rounded = Math.round(n * 100) / 100;
    return rounded.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const fmtTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">

        {/* ══════════════════════════════════════════════════════════════
            Header
            ══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-[28px] font-bold tracking-tight text-gray-900">
              Wallet & Payouts
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Your earnings, escrow balance, and payout history.
            </p>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => refetch()}
              className="flex items-center justify-center gap-2 px-4 h-10 rounded-sm bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sync</span>
            </button>
            <Button
              type="button"
              onClick={handleWithdraw}
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white font-semibold h-10 px-5 rounded-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all text-sm"
            >
              <ArrowDownToLine className="w-4 h-4" />
              Withdraw
            </Button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            4 Metric Cards
            ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isWalletLoading ? (
            <>
              <BalanceCardSkeleton />
              <BalanceCardSkeleton />
              <BalanceCardSkeleton />
              <BalanceCardSkeleton />
            </>
          ) : (
            <>
              {/* Available for Payout */}
              <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow">
                <div className="flex justify-between items-start mb-5">
                  <div className="w-10 h-10 rounded-sm bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Wallet className="w-[22px] h-[22px]" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    Available
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Available for Payout
                </p>
                <h3 className="text-[26px] font-extrabold text-gray-900 tracking-tight leading-none">
                  {currency} {fmt(availableBalance)}
                </h3>
                <button
                  type="button"
                  onClick={handleWithdraw}
                  className="mt-4 text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Withdraw <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              {/* In Escrow */}
              <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow">
                <div className="flex justify-between items-start mb-5">
                  <div className="w-10 h-10 rounded-sm bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-[22px] h-[22px]" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    Escrow
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  In Escrow (Pending)
                </p>
                <h3 className="text-[26px] font-extrabold text-gray-900 tracking-tight leading-none">
                  {currency} {fmt(pendingBalance)}
                </h3>
                <p className="mt-4 text-[11px] text-gray-400">
                  Released upon gig completion
                </p>
              </div>

              {/* Total Earnings */}
              <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow">
                <div className="flex justify-between items-start mb-5">
                  <div className="w-10 h-10 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center">
                    <TrendingUp className="w-[22px] h-[22px]" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    Net
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Total Net Earnings
                </p>
                <h3 className="text-[26px] font-extrabold text-gray-900 tracking-tight leading-none">
                  {currency} {fmt(totalEarnings)}
                </h3>
                <p className="mt-4 text-[11px] text-gray-400">
                  After 2% platform fee
                </p>
              </div>

              {/* Total Withdrawn */}
              <div className="rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow">
                <div className="flex justify-between items-start mb-5">
                  <div className="w-10 h-10 rounded-sm bg-violet-50 text-violet-600 flex items-center justify-center">
                    <ArrowDownToLine className="w-[22px] h-[22px]" />
                  </div>
                  <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    Paid
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Total Withdrawn
                </p>
                <h3 className="text-[26px] font-extrabold text-gray-900 tracking-tight leading-none">
                  {currency} {fmt(totalWithdrawn)}
                </h3>
                <p className="mt-4 text-[11px] text-gray-400">
                  Successfully paid out
                </p>
              </div>
            </>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            Payout Destination
            ══════════════════════════════════════════════════════════════ */}
        <div className="rounded-2xl bg-white p-5 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
                {connectedAccount ? (
                  isMobile ? <Smartphone className="w-6 h-6 text-primary" /> : <Building2 className="w-6 h-6 text-primary" />
                ) : (
                  <CreditCard className="w-6 h-6 text-gray-300" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-gray-900">
                    Payout Destination
                  </h3>
                  {connectedAccount ? (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-primary/8 text-primary px-2 py-0.5 rounded-md">
                        {gatewayLabel(connectedAccount.gateway)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">
                      <AlertCircle className="w-3 h-3" />
                      Not Connected
                    </span>
                  )}
                </div>

                {connectedAccount ? (
                  <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-gray-700">
                      {connectedAccount.accountName || (connectedAccount as any).metadata?.accountName || 'Connected Account'}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span>{connectedAccount.bankName || (connectedAccount as any).metadata?.bankName || 'Settlement Bank'}</span>
                    <span className="text-gray-300">·</span>
                    <span className="font-mono">•••• {connectedAccount.accountId?.slice(-4) || '****'}</span>
                    <span className="text-gray-300">·</span>
                    <span className="uppercase text-[11px] font-semibold text-gray-400">
                      {(connectedAccount as any).currencyCode || currency} ({(connectedAccount as any).countryCode || 'KE'})
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 mt-0.5">
                    Connect a bank or mobile wallet to receive your earnings.
                  </p>
                )}
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setConnectModalOpen(true)}
              className={`h-9 px-4 rounded-sm bg-primary hover:bg-primary/90 font-medium text-sm cursor-pointer transition-all shrink-0 ${
                connectedAccount
                  ? 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  : 'bg-primary hover:bg-primary/90 text-white shadow-sm'
              }`}
            >
              {connectedAccount ? 'Change Account' : 'Connect Account'}
            </Button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            Tabs
            ══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-1 bg-gray-100/60 p-1 rounded-sm w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('ledgers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'ledgers'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Ledger
            <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full ${
              activeTab === 'ledgers' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {ledgers.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('withdrawals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'withdrawals'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Payouts
            <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full ${
              activeTab === 'withdrawals' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {payoutRequests.length}
            </span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            Ledger Table
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'ledgers' ? (
          <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Audit Ledger</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Every balance movement — deposits, releases, withdrawals, and reversals.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-t border-b border-gray-100 bg-gray-50/50">
                    <th className="py-3 px-6 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="py-3 px-6 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="py-3 px-6 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Reference</th>
                    <th className="py-3 px-6 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Amount</th>
                    <th className="py-3 px-6 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Balance After</th>
                    <th className="py-3 px-6 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isWalletLoading ? (
                    <TableSkeleton rows={5} />
                  ) : paginatedLedgers.length > 0 ? (
                    paginatedLedgers.map((l: any, idx: number) => {
                      const isCredit = CREDIT_TYPES.has(l.type);
                      const isDebit = DEBIT_TYPES.has(l.type);
                      const info = LEDGER_LABELS[l.type] || { label: l.type.replace(/_/g, ' '), color: 'slate' };
                      const statusStyle = STATUS_STYLES[l.status] || 'bg-gray-50 text-gray-600';

                      return (
                        <tr key={l.id || idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3.5 px-6">
                            <div className="text-sm text-gray-700">{fmtDate(l.createdAt)}</div>
                            <div className="text-[11px] text-gray-400">{fmtTime(l.createdAt)}</div>
                          </td>
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                                isCredit ? 'bg-emerald-50 text-emerald-500' : isDebit ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'
                              }`}>
                                {isCredit ? <ArrowDown className="w-3.5 h-3.5" /> : isDebit ? <ArrowUp className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
                              </div>
                              <span className="text-sm font-medium text-gray-800">{info.label}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-6">
                            <span className="text-xs text-gray-400 font-mono">
                              {l.referenceId ? (l.referenceId.length > 28 ? l.referenceId.substring(0, 28) + '…' : l.referenceId) : '—'}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <span className={`text-sm font-semibold ${isCredit ? 'text-emerald-600' : isDebit ? 'text-red-600' : 'text-gray-800'}`}>
                              {isCredit ? '+' : isDebit ? '−' : ''}
                              {currency} {fmt(Number(l.amount))}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <span className="text-sm font-medium text-gray-600">
                              {currency} {fmt(Number(l.newBalance ?? 0))}
                            </span>
                          </td>
                          <td className="py-3.5 px-6">
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${statusStyle}`}>
                              {l.status || 'COMPLETED'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Wallet className="w-8 h-8 text-gray-200" />
                          <p className="text-sm">No transactions yet</p>
                          <p className="text-xs">When clients pay for bookings, your earnings will appear here.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalLedgerRows > 10 && (
              <div className="border-t border-gray-100 bg-white">
                <PaginationControls
                  pagination={ledgerPagination}
                  onPaginationChange={setLedgerPagination}
                  totalPages={totalLedgerPages}
                  totalRows={totalLedgerRows}
                  pageSizeOptions={[10, 20, 30, 50]}
                />
              </div>
            )}
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════════
             Payout Transfers Table
             ══════════════════════════════════════════════════════════════ */
          <div className="rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-6 py-5">
              <h2 className="text-base font-bold text-gray-900">Payout Transfers</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                History of withdrawals sent to your bank or mobile wallet.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-t border-b border-gray-100 bg-gray-50/50">
                    <th className="py-3 px-6 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Reference</th>
                    <th className="py-3 px-6 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Gateway</th>
                    <th className="py-3 px-6 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="py-3 px-6 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Amount</th>
                    <th className="py-3 px-6 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Fee</th>
                    <th className="py-3 px-6 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isWalletLoading ? (
                    <TableSkeleton rows={4} />
                  ) : paginatedPayouts.length > 0 ? (
                    paginatedPayouts.map((p: any, idx: number) => {
                      const statusStyle = STATUS_STYLES[p.status] || 'bg-gray-50 text-gray-600';

                      return (
                        <tr key={p.id || idx} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="py-3.5 px-6">
                            <span className="text-sm font-mono font-medium text-gray-700">
                              {p.transferReference
                                ? (p.transferReference.length > 24 ? p.transferReference.substring(0, 24) + '…' : p.transferReference)
                                : p.id?.substring(0, 10).toUpperCase() || '—'}
                            </span>
                          </td>
                          <td className="py-3.5 px-6">
                            <span className="text-sm text-gray-600 font-medium">
                              {gatewayLabel(p.gateway)}
                            </span>
                          </td>
                          <td className="py-3.5 px-6">
                            <div className="text-sm text-gray-700">{fmtDate(p.createdAt)}</div>
                            <div className="text-[11px] text-gray-400">{fmtTime(p.createdAt)}</div>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <span className="text-sm font-semibold text-gray-800">
                              {currency} {fmt(Number(p.amount))}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <span className="text-sm text-gray-400">
                              {p.fee && Number(p.fee) > 0 ? `${currency} ${fmt(Number(p.fee))}` : 'Free'}
                            </span>
                          </td>
                          <td className="py-3.5 px-6">
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${statusStyle}`}>
                              {p.status}
                            </span>
                            {p.failureReason && (
                              <p className="text-[10px] text-red-500 mt-1 max-w-[180px] truncate" title={p.failureReason}>
                                {p.failureReason}
                              </p>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <ArrowDownToLine className="w-8 h-8 text-gray-200" />
                          <p className="text-sm">No payouts yet</p>
                          <p className="text-xs">Your withdrawal history will appear here.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPayoutRows > 10 && (
              <div className="border-t border-gray-100 bg-white">
                <PaginationControls
                  pagination={payoutPagination}
                  onPaginationChange={setPayoutPagination}
                  totalPages={totalPayoutPages}
                  totalRows={totalPayoutRows}
                  pageSizeOptions={[10, 20, 30, 50]}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ────────────────────────────────────────────────────── */}
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
        defaultCountry={tenantCountry}
        defaultStageName={stageName}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
