/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Label,
} from '@repo/ui';
import { useRequestWithdrawalMutation } from '@repo/store';
import {
  ArrowDownToLine,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  Smartphone,
  BadgeCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  availableBalance: number;
  currency: string;
  connectedAccount: any;
  onSuccess?: () => void;
}

export default function WithdrawModal({
  isOpen,
  onClose,
  tenantId,
  availableBalance,
  currency,
  connectedAccount,
  onSuccess,
}: WithdrawModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [requestWithdrawal, { isLoading }] = useRequestWithdrawalMutation();

  const numAmount = parseFloat(amount) || 0;
  const remaining = Math.max(0, availableBalance - numAmount);
  const isValidAmount = numAmount > 0 && numAmount <= availableBalance;

  const fmt = (n: number) =>
    Math.round(n * 100) / 100 === 0
      ? '0.00'
      : (Math.round(n * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleSetMax = () => {
    setAmount(availableBalance.toString());
    setError(null);
  };

  const handleSetHalf = () => {
    const half = Math.floor(availableBalance / 2);
    setAmount(half.toString());
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAmount(val);
    const n = parseFloat(val);
    if (n > availableBalance) {
      setError(`Amount exceeds your available balance of ${currency} ${fmt(availableBalance)}`);
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAmount) {
      setError('Please enter a valid amount within your available balance.');
      return;
    }

    if (!connectedAccount) {
      toast.error('Please connect a payout bank or mobile money account first.');
      return;
    }

    try {
      await requestWithdrawal({
        tenantId,
        amount: numAmount,
      }).unwrap();

      toast.success(`Withdrawal of ${currency} ${fmt(numAmount)} submitted!`);
      setAmount('');
      setError(null);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg = err?.data?.message || err?.data?.error?.message || err?.message || 'Failed to submit withdrawal request';
      setError(msg);
      toast.error(msg);
    }
  };

  const isMobile = connectedAccount?.gateway === 'PESAPAL';

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setAmount('');
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[420px] bg-white text-gray-900 rounded-2xl p-0 shadow-2xl border-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ArrowDownToLine className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900 tracking-tight">
                  Request Payout
                </DialogTitle>
                <DialogDescription className="text-gray-500 text-[13px]">
                  Transfer cleared earnings to your account.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          {/* Available Balance Box */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Available
              </span>
              <p className="text-xl font-extrabold text-gray-900 leading-none mt-0.5">
                {currency} {fmt(availableBalance)}
              </p>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={handleSetHalf}
                className="px-2.5 py-1 text-[11px] font-semibold bg-white text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                50%
              </button>
              <button
                type="button"
                onClick={handleSetMax}
                className="px-2.5 py-1 text-[11px] font-semibold bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors cursor-pointer"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <Label className="text-[12px] font-semibold text-gray-600">Amount ({currency})</Label>
            <Input
              type="number"
              min={1}
              max={availableBalance}
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={handleChange}
              className="bg-gray-50 border-gray-200 text-gray-900 h-12 text-lg font-bold rounded-xl focus:border-primary focus:ring-primary/20"
            />
          </div>

          {/* Destination Preview */}
          <div className="space-y-1.5">
            <Label className="text-[12px] font-semibold text-gray-600">Destination</Label>
            {connectedAccount ? (
              <div className="p-3 rounded-xl bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-700 shadow-sm">
                    {isMobile ? <Smartphone className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {connectedAccount.accountName || connectedAccount.metadata?.accountName || 'Connected Account'}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {connectedAccount.bankName || connectedAccount.metadata?.bankName || (isMobile ? 'Mobile Money' : 'Bank Transfer')} •••• {connectedAccount.accountId?.slice(-4) || '****'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-semibold">
                  <BadgeCheck className="w-3.5 h-3.5" />
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>No payout account linked. Connect one first.</span>
              </div>
            )}
          </div>

          {/* Summary */}
          {numAmount > 0 && (
            <div className="p-3.5 rounded-xl bg-gray-50 space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Transfer Amount</span>
                <span className="font-semibold text-gray-900">{currency} {fmt(numAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Transfer Fee</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between border-t border-gray-200/60 pt-2 text-gray-900 font-bold">
                <span>Remaining</span>
                <span>{currency} {fmt(remaining)}</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer */}
          <DialogFooter className="pt-3 border-t border-gray-100 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-10 px-5 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValidAmount || !connectedAccount || isLoading}
              className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl h-10 px-6 shadow-sm disabled:opacity-50 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Confirm Withdrawal'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
