/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@repo/ui';
import { Building2, Phone, Save, Info } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetPaymentInstructionsQuery,
  useUpdatePaymentInstructionsMutation,
} from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';

export function PaymentInstructionsTab() {
  const { data: instructionsResponse, isLoading, refetch } = useGetPaymentInstructionsQuery();
  const [updateInstructions, { isLoading: isUpdating }] = useUpdatePaymentInstructionsMutation();

  const [enabled, setEnabled] = useState(true);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState('M-Pesa');
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (instructionsResponse?.data) {
      const data = instructionsResponse.data;
      setEnabled(data.enabled ?? true);
      setBankName(data.bankName || '');
      setAccountNumber(data.accountNumber || '');
      setAccountName(data.accountName || '');
      setMobileMoneyProvider(data.mobileMoneyProvider || 'M-Pesa');
      setMobileMoneyNumber(data.mobileMoneyNumber || '');
      setInstructions(data.instructions || '');
    }
  }, [instructionsResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateInstructions({
        enabled,
        bankName: bankName.trim() || undefined,
        accountNumber: accountNumber.trim() || undefined,
        accountName: accountName.trim() || undefined,
        mobileMoneyProvider: mobileMoneyProvider.trim() || undefined,
        mobileMoneyNumber: mobileMoneyNumber.trim() || undefined,
        instructions: instructions.trim() || undefined,
      }).unwrap();

      toast.success('Direct payment instructions saved successfully!');
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save payment instructions.');
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mb-12">
      {/* Notice Card */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 flex items-start gap-3.5 text-xs text-amber-900 leading-relaxed">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-sm text-amber-950 mb-0.5">
            Direct Client Settlement Instructions
          </p>
          <p>
            UpBeat Africa coordinates bookings and quotations. We do not hold client funds in escrow or deduct payment gateway fees from your booking earnings. Clients receive the details configured below to pay you directly via Bank Transfer, Mobile Money, or Cash.
          </p>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Payment Instruction Visibility
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Display these payment details automatically on client booking confirmation portals.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Bank Wire Details */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-gray-500" />
            Bank Transfer / Wire Coordinates
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Bank / Financial Institution
              </label>
              <Input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. Equity Bank, Standard Bank, GTBank"
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Account Holder Name
              </label>
              <Input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="e.g. John Doe / DJ Stage Name"
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Account Number / IBAN / Paybill / Till Number
              </label>
              <Input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. 0110928392819 or Paybill: 247247 Acc: 0712..."
                className="h-10 rounded-xl text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Mobile Money Details */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-gray-500" />
            Mobile Money Details
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mobile Network / Provider
              </label>
              <Input
                type="text"
                value={mobileMoneyProvider}
                onChange={(e) => setMobileMoneyProvider(e.target.value)}
                placeholder="e.g. M-Pesa, MTN MoMo, Airtel Money"
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mobile Money Phone Number
              </label>
              <Input
                type="text"
                value={mobileMoneyNumber}
                onChange={(e) => setMobileMoneyNumber(e.target.value)}
                placeholder="e.g. +254 712 345 678"
                className="h-10 rounded-xl text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <label className="block text-xs font-semibold text-gray-700">
            Payment Terms & Additional Notes for Client
          </label>
          <textarea
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Please include your Booking Reference (UB-XXXXXXXX) as the transfer description. 50% deposit required upon booking acceptance, balance 50% on event date."
            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button
            type="submit"
            disabled={isUpdating}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 font-bold text-xs flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>{isUpdating ? 'Saving...' : 'Save Payment Instructions'}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
