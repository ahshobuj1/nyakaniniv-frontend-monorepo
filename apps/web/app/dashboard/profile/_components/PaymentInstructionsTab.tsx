/* eslint-disable react-hooks/incompatible-library */
'use client';

import React, {useEffect, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@repo/ui';
import {toast} from 'sonner';
import {
  useGetPaymentInstructionsQuery,
  useUpdatePaymentInstructionsMutation,
} from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  paymentInstructionsSchema,
  PaymentInstructionsFormValues,
  inputBaseClass,
  labelClass,
} from './profile.schema';

export function PaymentInstructionsTab() {
  const {
    data: instructionsResponse,
    isLoading,
    refetch,
  } = useGetPaymentInstructionsQuery();
  const [updateInstructions] = useUpdatePaymentInstructionsMutation();

  const isInitializedRef = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: {isSubmitting},
  } = useForm<PaymentInstructionsFormValues>({
    resolver: zodResolver(paymentInstructionsSchema),
    defaultValues: {
      enabled: true,
      bankName: '',
      accountNumber: '',
      accountName: '',
      mobileMoneyProvider: 'M-Pesa',
      mobileMoneyNumber: '',
      instructions: '',
    },
  });

  const isEnabled = watch('enabled');

  useEffect(() => {
    if (instructionsResponse?.data && !isInitializedRef.current) {
      isInitializedRef.current = true;
      const data = instructionsResponse.data;
      reset({
        enabled: data.enabled ?? true,
        bankName: data.bankName || '',
        accountNumber: data.accountNumber || '',
        accountName: data.accountName || '',
        mobileMoneyProvider: data.mobileMoneyProvider || 'M-Pesa',
        mobileMoneyNumber: data.mobileMoneyNumber || '',
        instructions: data.instructions || '',
      });
    }
  }, [instructionsResponse, reset]);

  const onSubmit = async (values: PaymentInstructionsFormValues) => {
    try {
      await updateInstructions({
        enabled: values.enabled,
        bankName: values.bankName?.trim() || undefined,
        accountNumber: values.accountNumber?.trim() || undefined,
        accountName: values.accountName?.trim() || undefined,
        mobileMoneyProvider: values.mobileMoneyProvider?.trim() || undefined,
        mobileMoneyNumber: values.mobileMoneyNumber?.trim() || undefined,
        instructions: values.instructions?.trim() || undefined,
      }).unwrap();

      reset(values);
      toast.success('Payment instructions saved successfully!');
      refetch();
    } catch (error: unknown) {
      const err = error as {data?: {message?: string}};
      toast.error(err?.data?.message || 'Failed to save payment instructions.');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[350px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-12">
      <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-6 md:p-8">
        {/* Header: Title & Switch */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-800">
              Direct Payment Details
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              These details are displayed on booking invoices so clients can pay
              you directly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500">
              {isEnabled ? 'Active' : 'Disabled'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) =>
                  setValue('enabled', e.target.checked, {shouldDirty: true})
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Section 1: Bank Transfer */}
        <div className="mb-8">
          <h4 className="text-sm font-bold text-gray-800 mb-4">
            Bank Transfer Coordinates
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Bank Name</label>
              <input
                {...register('bankName')}
                placeholder="e.g. Equity Bank, Stanbic Bank"
                className={inputBaseClass}
              />
            </div>

            <div>
              <label className={labelClass}>Account Holder Name</label>
              <input
                {...register('accountName')}
                placeholder="e.g. John Doe / DJ Stage Name"
                className={inputBaseClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                Account Number / IBAN / Paybill
              </label>
              <input
                {...register('accountNumber')}
                placeholder="e.g. 0110928392819 or Paybill: 247247 Acc: 0712345678"
                className={inputBaseClass}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Mobile Money */}
        <div className="mb-8 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-bold text-gray-800 mb-4">
            Mobile Money (Optional)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Provider</label>
              <input
                {...register('mobileMoneyProvider')}
                placeholder="e.g. M-Pesa, MTN MoMo, Airtel Money"
                className={inputBaseClass}
              />
            </div>

            <div>
              <label className={labelClass}>Mobile Number / Till</label>
              <input
                {...register('mobileMoneyNumber')}
                placeholder="e.g. +254 712 345 678"
                className={inputBaseClass}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Notes / Instructions */}
        <div className="pt-6 border-t border-gray-100">
          <h4 className="text-sm font-bold text-gray-800 mb-4">
            Client Instructions / Terms
          </h4>
          <div>
            <label className={labelClass}>Invoice Note (Optional)</label>
            <textarea
              {...register('instructions')}
              rows={3}
              placeholder="e.g. Please use your Booking ID as reference. 50% deposit required upon confirmation."
              className={`${inputBaseClass} resize-y min-h-[90px]`}
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-2">
        <Button
          size={'lg'}
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-3 px-10 rounded-sm shadow-sm transition-all active:scale-95 disabled:opacity-70 cursor-pointer">
          {isSubmitting ? 'Saving...' : 'Save Payment Details'}
        </Button>
      </div>
    </form>
  );
}
