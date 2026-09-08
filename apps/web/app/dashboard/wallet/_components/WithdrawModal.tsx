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
      setError(`Amount exceeds your available balance of ${currency} ${availableBalance.toLocaleString()}`);
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

      toast.success(`Withdrawal request of ${currency} ${numAmount.toLocaleString()} submitted successfully!`);
      setAmount('');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Failed to submit withdrawal request';
      setError(msg);
      toast.error(msg);
    }
  };

  const isMobile = connectedAccount?.gateway === 'PESAPAL';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white text-[#111620] border border-gray-100 rounded-2xl p-6 md:p-8 shadow-2xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ArrowDownToLine className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-[20px] font-bold text-[#111620] tracking-tight">
                Request Payout
              </DialogTitle>
              <DialogDescription className="text-[#787878] text-[14px]">
                Transfer your cleared DJ earnings to your payout destination.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-3">
          {/* Available Balance Box */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-[#787878] uppercase tracking-wider">
                Available for Payout
              </span>
              <p className="text-[22px] font-extrabold text-[#111620]">
                {currency} {availableBalance.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={handleSetHalf}
                className="px-2.5 py-1 text-xs font-semibold bg-white border border-[#E5E7EB] text-[#111620] hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                50%
              </button>
              <button
                type="button"
                onClick={handleSetMax}
                className="px-2.5 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded-lg transition-colors cursor-pointer"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <Label className="text-[13px] font-semibold text-[#111620]">Withdrawal Amount ({currency})</Label>
            <Input
              type="number"
              min={1}
              max={availableBalance}
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={handleChange}
              className="bg-[#F9FAFB] border-[#E5E7EB] text-[#111620] h-12 text-lg font-bold rounded-xl focus:border-primary focus:ring-primary/20"
            />
          </div>

          {/* Destination Preview */}
          <div className="space-y-1.5">
            <Label className="text-[13px] font-semibold text-[#111620]">Payout Destination</Label>
            {connectedAccount ? (
              <div className="p-3.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-[#111620]">
                    {isMobile ? <Smartphone className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111620]">
                      {connectedAccount.accountName || connectedAccount.metadata?.accountName || 'Connected Account'}
                    </p>
                    <p className="text-xs text-[#787878]">
                      {connectedAccount.bankName || connectedAccount.metadata?.bankName || (isMobile ? 'Mobile Money' : 'Bank Transfer')} ••••{' '}
                      {connectedAccount.accountId?.slice(-4) || '****'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>No payout account linked. Please connect a bank or mobile money account first.</span>
              </div>
            )}
          </div>

          {/* Summary Breakdown */}
          {numAmount > 0 && (
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-[#787878]">
                <span>Transfer Amount:</span>
                <span className="font-semibold text-[#111620]">{currency} {numAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#787878]">
                <span>Transfer Fee:</span>
                <span className="font-semibold text-emerald-600">Free (0%)</span>
              </div>
              <div className="flex justify-between border-t border-gray-200/60 pt-2 text-[#111620] font-bold">
                <span>Remaining Balance:</span>
                <span>{currency} {remaining.toLocaleString()}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-gray-100 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-200 text-[#111620] hover:bg-gray-50 rounded-xl h-11 px-5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValidAmount || !connectedAccount || isLoading}
              className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-11 px-6 shadow-sm disabled:opacity-50"
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
