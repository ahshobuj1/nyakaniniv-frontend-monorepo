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
import { ArrowDownToLine, CheckCircle2, AlertCircle, Loader2, Landmark, Smartphone } from 'lucide-react';
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-[#0F131D] text-white border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <ArrowDownToLine className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white tracking-tight">
                Withdraw Earnings
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-xs mt-0.5">
                Transfer your unlocked funds to your verified payout account.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Balance Status Banner */}
        <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 font-medium">Available Balance</p>
            <p className="text-2xl font-bold text-white font-mono mt-0.5">
              {currency} {availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={handleSetHalf}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 transition-colors"
            >
              50%
            </button>
            <button
              type="button"
              onClick={handleSetMax}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#0BA4DB]/20 hover:bg-[#0BA4DB]/30 text-[#0BA4DB] transition-colors"
            >
              Max
            </button>
          </div>
        </div>

        {/* Destination Account Preview */}
        <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
          <p className="text-[11px] text-gray-400 uppercase font-semibold tracking-wider mb-1.5">
            Payout Destination
          </p>
          {connectedAccount ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                  {connectedAccount.gateway === 'PESAPAL' ? (
                    <Smartphone className="w-4 h-4" />
                  ) : (
                    <Landmark className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{connectedAccount.bankName}</p>
                  <p className="text-[11px] text-gray-400 font-mono">{connectedAccount.accountId || connectedAccount.accountNumber}</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold uppercase">
                Active
              </span>
            </div>
          ) : (
            <p className="text-xs text-amber-400">No payout account linked yet. Please connect an account first.</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Withdrawal Amount ({currency})
            </Label>
            <div className="relative">
              <Input
                type="number"
                step="0.01"
                min="1"
                max={availableBalance}
                placeholder="0.00"
                value={amount}
                onChange={handleChange}
                className="w-full h-12 bg-white/5 border-white/10 rounded-xl text-white font-mono text-lg font-bold tracking-wider focus:border-[#0BA4DB]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                {currency}
              </span>
            </div>
          </div>

          {numAmount > 0 && numAmount <= availableBalance && (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5 text-xs text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Withdrawal Amount:</span>
                <span className="font-mono font-bold text-white">
                  {currency} {numAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Remaining Balance:</span>
                <span className="font-mono text-gray-300">
                  {currency} {remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-[10px] text-emerald-400/90 pt-1 border-t border-white/5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Protected by UpBeat Escrow: If provider payout fails, funds are automatically restored to your wallet.</span>
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-white/10 text-gray-300 hover:bg-white/5 hover:text-white rounded-xl h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValidAmount || isLoading || !connectedAccount}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
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
