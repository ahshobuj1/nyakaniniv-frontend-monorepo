/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
'use client';

import React from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {toast} from 'sonner';
import {Button} from '@repo/ui';
import {Country, City} from 'country-state-city';
import {useEffect, useState} from 'react';
import {Check, ChevronsUpDown} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  cn,
} from '@repo/ui';
import Image from 'next/image';

// 1. Validation Schemas
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  stageName: z.string().min(1, 'Stage name is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  email: z.string().email('Invalid email address'),
  subdomain: z.string().optional(),
  genres: z.array(z.string()),
  socialLinks: z.object({
    instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
    facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
    linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  }).optional(),
  profileImage: z.any().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const ALL_GENRES = [
  'Afrobeat',
  'Gengetone',
  'Afro-fusion',
  'Amapiano',
  'Bongo Flava',
  'Hip Hop',
  'RnB',
  'Pop',
  'Kompa',
  'Reggae',
  'Dancehall',
  'Soul',
  'Rock',
  'Latin',
  'Jazz',
  'Country',
  'Lingala',
];

import {
  useGetCurrentProfileQuery,
  useUpdateCurrentProfileMutation,
  useUpdateTenantProfileMutation,
  useChangePasswordMutation,
} from '@repo/store';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProfileContent() {
  const { data: profileResponse, isLoading: isProfileLoading, refetch } = useGetCurrentProfileQuery();
  const [updateUser] = useUpdateCurrentProfileMutation();
  const [updateTenant] = useUpdateTenantProfileMutation();
  const [changePasswordMutation] = useChangePasswordMutation();

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

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: {errors: passwordErrors, isSubmitting: isSubmittingPassword},
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  const [countries] = useState(Country.getAllCountries());
  const selectedCountry = watch('country');
  const [cities, setCities] = useState<any[]>([]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  // Pre-fill form when profile data loads
  useEffect(() => {
    if (profileResponse?.data) {
      const user = profileResponse.data;
      const tenant = user.tenant;

      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        stageName: tenant?.stageName || '',
        email: user.email || '',
        subdomain: tenant?.subdomain || '',
        country: tenant?.country || '',
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

  useEffect(() => {
    if (selectedCountry) {
      const countryCities = City.getCitiesOfCountry(selectedCountry);
      setCities(countryCities || []);
    } else {
      setCities([]);
    }
  }, [selectedCountry]);

  // Reset city when country changes
  useEffect(() => {
    if (selectedCountry && profileResponse?.data) {
      const currentCity = watch('city');
      const countryCities = City.getCitiesOfCountry(selectedCountry);
      const cityExists = countryCities?.some(c => c.name === currentCity) ?? false;
      if (!cityExists && currentCity !== '') {
        // Only reset if the city doesn't exist in the new country and it wasn't just populated from initial load
        setValue('city', '', { shouldDirty: true });
      }
    }
  }, [selectedCountry, setValue, watch, profileResponse]);

  const selectedGenres = watch('genres') || [];

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setValue(
        'genres',
        selectedGenres.filter((g) => g !== genre),
        {shouldDirty: true},
      );
    } else {
      setValue('genres', [...selectedGenres, genre], {shouldDirty: true});
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Update User Level Data
      await updateUser({
        firstName: data.firstName,
        lastName: data.lastName,
        profileImage: data.profileImage,
      }).unwrap();

      // Update Tenant Level Data (if applicable)
      if (profileResponse?.data?.tenant) {
        await updateTenant({
          stageName: data.stageName,
          country: data.country,
          city: data.city,
          genres: data.genres,
          socialLinks: data.socialLinks,
        }).unwrap();
      }

      toast.success('Profile updated successfully!');
      refetch();
    } catch (error: any) {
      const errorMsg = error?.data?.error?.message || error?.data?.message || 'Failed to update profile.';
      toast.error(errorMsg);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      await changePasswordMutation({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success('Password changed successfully!');
      resetPassword();
    } catch (error: any) {
      const errorMsg = error?.data?.error?.message || error?.data?.message || 'Failed to change password.';
      toast.error(errorMsg);
    }
  };

  if (isProfileLoading) {
    return <LoadingSpinner />;
  }

  // Changed to standard Tailwind classes
  const inputBaseClass =
    'w-full bg-gray-100 border border-transparent rounded-xl px-4 py-3 text-sm text-gray-700 focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all placeholder:text-gray-400';
  const labelClass = 'block text-sm font-semibold text-gray-800 mb-2';

  return (
    <div className="w-full bg-slate-50 min-h-full p-6 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile</h1>
        <p className="text-sm text-gray-500">
          View and manage your personal information here.
        </p>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-12">
        {/* Profile Image Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md flex items-center justify-center relative">
              {watch('profileImage') ? (
                <Image 
                  src={URL.createObjectURL(watch('profileImage'))} 
                  alt="Profile" 
                  fill 
                  className="object-cover"
                />
              ) : profileResponse?.data?.profileImg ? (
                <Image 
                  src={profileResponse.data.profileImg} 
                  alt="Profile" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <span className="text-3xl text-gray-400 font-bold">
                  {watch('firstName')?.[0]}{watch('lastName')?.[0]}
                </span>
              )}
              
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white text-xs font-semibold">Upload</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setValue('profileImage', file, { shouldDirty: true });
                    }
                  }} 
                />
              </label>
            </div>
          </div>
          <div className="text-center sm:text-left mt-2 sm:mt-4">
            <h3 className="text-lg font-bold text-gray-900">Profile Image</h3>
            <p className="text-sm text-gray-500 max-w-sm mt-1">
              Upload a professional picture. It will be displayed on your dashboard and landing page.
            </p>
          </div>
        </div>

        {/* Section 1: Personal Information Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>First Name</label>
              <input
                {...register('firstName')}
                placeholder="DJ Kwame"
                className={inputBaseClass}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Last Name</label>
              <input
                {...register('lastName')}
                placeholder="Beats"
                className={inputBaseClass}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Stage Name</label>
              <input
                {...register('stageName')}
                placeholder="DJ Aura"
                className={inputBaseClass}
              />
              {errors.stageName && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.stageName.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Subdomain</label>
              <div className="flex items-center">
                <input
                  {...register('subdomain')}
                  placeholder="aura"
                  className={`${inputBaseClass} rounded-r-none border-r-0 text-gray-500`}
                  disabled
                />
                <span className="bg-gray-100 border border-transparent border-l-gray-200 px-4 py-3 text-sm text-gray-500 rounded-r-xl font-medium">
                  .upbeatafrica.com
                </span>
              </div>
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                {...register('email')}
                placeholder="kwame@djkwamebeats.com"
                className={inputBaseClass}
                disabled
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Country</label>
              <div className="relative">
                <Popover open={countryOpen} onOpenChange={setCountryOpen} >
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      role="combobox"
                      aria-expanded={countryOpen}
                      aria-controls="country-options"
                      className={`${inputBaseClass} flex cursor-pointer items-center justify-between`}>
                      {selectedCountry ? (
                        <div className="flex items-center gap-2">
                          <Image
                            src={`https://flagcdn.com/w40/${selectedCountry.toLowerCase()}.png`}
                            alt={selectedCountry}
                            width={20}
                            height={15}
                            className="object-contain"
                          />
                          {countries.find((c) => c.isoCode === selectedCountry)?.name}
                        </div>
                      ) : (
                        <span className="text-gray-400">Select Country</span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent id="country-options" className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {countries.map((country) => (
                            <CommandItem
                              key={country.isoCode}
                              value={country.name}
                              onSelect={() => {
                                setValue('country', country.isoCode, {shouldDirty: true});
                                setCountryOpen(false);
                              }}>
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  selectedCountry === country.isoCode
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              <div className="flex items-center gap-2">
                                <Image
                                  src={`https://flagcdn.com/w40/${country.isoCode.toLowerCase()}.png`}
                                  alt={country.name}
                                  width={20}
                                  height={15}
                                  className="object-contain"
                                />
                                {country.name}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              {errors.country && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.country.message}
                </p>
              )}
            </div>
            
            <div>
              <label className={labelClass}>City</label>
              <div className="relative">
                <Popover open={cityOpen} onOpenChange={setCityOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      role="combobox"
                      aria-expanded={cityOpen}
                      aria-controls="city-options"
                      className={`${inputBaseClass} flex items-center justify-between`}>
                      {watch('city') || <span className="text-gray-400">Select City</span>}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent id="city-options" className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search city..." />
                      <CommandList>
                        <CommandEmpty>
                          {selectedCountry ? 'No city found.' : 'Select a country first.'}
                        </CommandEmpty>
                        <CommandGroup>
                          {cities.map((city) => (
                            <CommandItem
                              key={`${city.name}-${city.latitude}`}
                              value={city.name}
                              onSelect={() => {
                                setValue('city', city.name, {shouldDirty: true});
                                setCityOpen(false);
                              }}>
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  watch('city') === city.name ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                              {city.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              {errors.city && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.city.message}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Section: Social Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h3 className="text-base font-bold text-gray-800 pb-6 mb-6 border-b border-gray-200">
            Social Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Instagram URL</label>
              <input
                {...register('socialLinks.instagram')}
                placeholder="https://instagram.com/djkwame"
                className={inputBaseClass}
              />
              {errors.socialLinks?.instagram && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.socialLinks.instagram.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Facebook URL</label>
              <input
                {...register('socialLinks.facebook')}
                placeholder="https://facebook.com/djkwame"
                className={inputBaseClass}
              />
              {errors.socialLinks?.facebook && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.socialLinks.facebook.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>LinkedIn URL</label>
              <input
                {...register('socialLinks.linkedin')}
                placeholder="https://linkedin.com/in/djkwame"
                className={inputBaseClass}
              />
              {errors.socialLinks?.linkedin && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.socialLinks.linkedin.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Music Genres */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 h-full border border-gray-100">
          <h3 className="text-base font-bold text-gray-800 pb-6 mb-6 border-b border-gray-200">
            Music Genres
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {ALL_GENRES.map((genre) => {
              const isSelected = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors border
                    ${
                      isSelected
                        ? 'bg-red-50 border-red-300 text-red-500'
                        : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'
                    }`}>
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <Button
            size={'lg'}
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-3 px-10 rounded-md shadow-md transition-all active:scale-95 disabled:opacity-70">
            {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>

      {/* Password Change Form */}
      <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 h-full">
          <h3 className="text-base font-bold text-gray-800 pb-6 mb-6 border-b border-gray-200">
            Change Password
          </h3>
          <div className="space-y-6 max-w-md">
            <div>
              <label className={labelClass}>Current password</label>
              <input
                type="password"
                {...registerPassword('currentPassword')}
                placeholder="Enter your current password"
                className={inputBaseClass}
              />
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-xs mt-1.5">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>New password</label>
              <input
                type="password"
                {...registerPassword('newPassword')}
                placeholder="Enter your new password"
                className={inputBaseClass}
              />
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-xs mt-1.5">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>
            
            <div className="pt-2">
              <Button
                size={'lg'}
                type="submit"
                disabled={isSubmittingPassword}
                className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-3 px-10 rounded-md shadow-md transition-all active:scale-95 disabled:opacity-70">
                {isSubmittingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
