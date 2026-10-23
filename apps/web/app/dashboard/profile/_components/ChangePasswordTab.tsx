'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@repo/ui';
import { toast } from 'sonner';
import { useChangePasswordMutation } from '@repo/store';
import {
  passwordSchema,
  PasswordFormValues,
  inputBaseClass,
  labelClass,
} from './profile.schema';

export function ChangePasswordTab() {
  const [changePasswordMutation] = useChangePasswordMutation();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      await changePasswordMutation({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success('Password changed successfully!');
      reset();
    } catch (error: unknown) {
      const err = error as { data?: { error?: { message?: string }; message?: string } };
      const errorMsg =
        err?.data?.error?.message ||
        err?.data?.message ||
        'Failed to change password.';
      toast.error(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 md:p-8 max-w-2xl">
        <div className="border-b border-gray-100 pb-5 mb-6">
          <h3 className="text-base font-bold text-gray-800">
            Change Password
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Make sure to choose a strong password with at least 8 characters.
          </p>
        </div>

        <div className="space-y-5 max-w-md">
          <div>
            <label className={labelClass}>Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                {...register('currentPassword')}
                placeholder="Enter your current password"
                className={`${inputBaseClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                {showCurrentPassword ? (
                  <EyeOff size={18} strokeWidth={2} />
                ) : (
                  <Eye size={18} strokeWidth={2} />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                {...register('newPassword')}
                placeholder="Enter your new password"
                className={`${inputBaseClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                {showNewPassword ? (
                  <EyeOff size={18} strokeWidth={2} />
                ) : (
                  <Eye size={18} strokeWidth={2} />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder="Confirm your new password"
                className={`${inputBaseClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                {showConfirmPassword ? (
                  <EyeOff size={18} strokeWidth={2} />
                ) : (
                  <Eye size={18} strokeWidth={2} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              size={'lg'}
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-3 px-10 rounded-sm shadow-sm transition-all active:scale-95 disabled:opacity-70 cursor-pointer">
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
