'use client';

import React, {useEffect, useState} from 'react';
import {useForm, FieldErrors} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {toast} from 'sonner';
import {Button} from '@repo/ui';
import {User, Lock, Banknote} from 'lucide-react';
import {getBrowserTimezone} from '@/lib/timezone';
import {getCurrencyForCountry} from '@/lib/currency';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  useGetCurrentProfileQuery,
  useUpdateCurrentProfileMutation,
  useUpdateTenantProfileMutation,
} from '@repo/store';

import {profileSchema, ProfileFormValues} from './_components/profile.schema';
import {ProfilePhotoSection} from './_components/ProfilePhotoSection';
import {PersonalDetailsSection} from './_components/PersonalDetailsSection';
import {SocialLinksSection} from './_components/SocialLinksSection';
import {MusicGenresSection} from './_components/MusicGenresSection';
import {ChangePasswordTab} from './_components/ChangePasswordTab';
import {PaymentInstructionsTab} from './_components/PaymentInstructionsTab';

export default function ProfileContent() {
  const {data: profileResponse, isLoading: isProfileLoading} =
    useGetCurrentProfileQuery();

  const [updateUser] = useUpdateCurrentProfileMutation();
  const [updateTenant] = useUpdateTenantProfileMutation();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'payment' | 'password'
  >('profile');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      stageName: '',
      city: '',
      country: '',
      timezone: 'Africa/Nairobi',
      currencyCode: 'KES',
      email: '',
      subdomain: '',
      genres: [],
      socialLinks: {
        instagram: '',
        facebook: '',
        linkedin: '',
      },
      profileImage: undefined,
    },
  });

  const isInitializedRef = React.useRef(false);

  // Pre-fill form when profile data loads initially
  useEffect(() => {
    if (profileResponse?.data && !isInitializedRef.current) {
      isInitializedRef.current = true;
      const user = profileResponse.data;
      const tenant = user.tenant;

      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        stageName: tenant?.stageName || '',
        email: user.email || '',
        subdomain: tenant?.subdomain || '',
        country: tenant?.country || '',
        timezone: tenant?.timezone || getBrowserTimezone(),
        currencyCode:
          tenant?.currencyCode ||
          getCurrencyForCountry(tenant?.country) ||
          'KES',
        city: tenant?.city || '',
        genres: tenant?.genres || [],
        socialLinks: {
          instagram: tenant?.socialLinks?.instagram || '',
          facebook: tenant?.socialLinks?.facebook || '',
          linkedin: tenant?.socialLinks?.linkedin || '',
        },
        profileImage: undefined,
      });
    }
  }, [profileResponse, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // 1. Update Tenant Profile first (country, city, stageName, etc.)
      if (profileResponse?.data?.tenant) {
        await updateTenant({
          stageName: data.stageName,
          country: data.country,
          city: data.city,
          timezone: data.timezone,
          currencyCode: data.currencyCode,
          genres: data.genres,
          socialLinks: data.socialLinks,
        }).unwrap();
      }

      // 2. Update User Profile (first name, last name, image)
      await updateUser({
        firstName: data.firstName,
        lastName: data.lastName,
        profileImage: data.profileImage,
      }).unwrap();

      // Immediately sync form state with newly saved values to prevent race resets
      reset(data);

      toast.success('Profile changes saved successfully!');
    } catch (error: unknown) {
      const err = error as {data?: {message?: string}};
      toast.error(err?.data?.message || 'Failed to update profile.');
    }
  };

  const onInvalid = (formErrors: FieldErrors<ProfileFormValues>) => {
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      const firstField = errorKeys[0];
      const message =
        formErrors[firstField as keyof ProfileFormValues]?.message ||
        `Please check the ${firstField} field`;
      toast.error(String(message));
    }
  };

  if (isProfileLoading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-full p-6 md:p-8 font-sans">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {activeTab === 'profile'
            ? 'Profile Settings'
            : activeTab === 'payment'
              ? 'Direct Payment Instructions'
              : 'Change Password'}
        </h1>
        <p className="text-sm text-gray-500">
          {activeTab === 'profile'
            ? 'View and manage your personal DJ information and preferences.'
            : activeTab === 'payment'
              ? 'Configure bank and mobile money accounts for client direct booking payments.'
              : 'Update and secure your account credentials.'}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 mb-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 pb-3.5 px-4 text-sm font-semibold transition-all relative cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-800'
          }`}>
          <User className="w-4 h-4" />
          Profile Settings
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payment')}
          className={`flex items-center gap-2 pb-3.5 px-4 text-sm font-semibold transition-all relative cursor-pointer whitespace-nowrap ${
            activeTab === 'payment'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-800'
          }`}>
          <Banknote className="w-4 h-4" />
          Direct Payment Instructions
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('password')}
          className={`flex items-center gap-2 pb-3.5 px-4 text-sm font-semibold transition-all relative cursor-pointer whitespace-nowrap ${
            activeTab === 'password'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-800'
          }`}>
          <Lock className="w-4 h-4" />
          Change Password
        </button>
      </div>

      {/* Profile Settings Tab */}
      {activeTab === 'profile' && (
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-6 mb-12">
          {/* Section: Profile Image */}
          <ProfilePhotoSection
            watch={watch}
            setValue={setValue}
            initialProfileImg={profileResponse?.data?.profileImg}
          />

          {/* Section: Personal & Regional Details */}
          <PersonalDetailsSection
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />

          {/* Section: Social Links */}
          <SocialLinksSection register={register} errors={errors} />

          {/* Section: Music Genres */}
          <MusicGenresSection watch={watch} setValue={setValue} />

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <Button
              size={'lg'}
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-3 px-10 rounded-sm shadow-sm transition-all active:scale-95 disabled:opacity-70 cursor-pointer">
              {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      )}

      {/* Direct Payment Instructions Tab */}
      {activeTab === 'payment' && <PaymentInstructionsTab />}

      {/* Password Change Tab */}
      {activeTab === 'password' && <ChangePasswordTab />}
    </div>
  );
}
