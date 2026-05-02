/* eslint-disable react-hooks/incompatible-library */
'use client';

import React from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {toast} from 'sonner';
import {Button} from '@repo/ui';

// 1. Validation Schema
const profileSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    genres: z.array(z.string()),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) return false;
      return true;
    },
    {
      message: 'Current password is required to set a new password',
      path: ['currentPassword'],
    },
  );

type ProfileFormValues = z.infer<typeof profileSchema>;

const ALL_GENRES = [
  'Afrobeats',
  'K-Pop',
  'Indie Rock',
  'Synthwave',
  'Lo-fi Hip Hop',
  'Classic Rock',
  'Jazz',
  'Bluegrass',
  'Pop Punk',
  'Flamenco',
  'Soul',
  'Funk',
  'R&B',
  'Alternative',
  'Dubstep',
  'Psychedelic Rock',
  'Tropical House',
];

export default function ProfileContent() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {errors, isSubmitting},
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: 'DJ Kwame',
      lastName: 'Beats',
      city: 'Accra',
      country: 'Africa',
      email: 'kwame@djkwamebeats.com',
      phone: '+233 55 123 4567',
      genres: [
        'Afrobeats',
        'K-Pop',
        'Indie Rock',
        'Classic Rock',
        'Bluegrass',
        'Pop Punk',
        'Alternative',
      ],
      currentPassword: '',
      newPassword: '',
    },
  });

  const selectedGenres = watch('genres');

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
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log('Form Data:', data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to update profile.');
    }
  };

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <label className={labelClass}>City</label>
              <div className="relative">
                <select
                  {...register('city')}
                  className={`${inputBaseClass} appearance-none cursor-pointer`}>
                  <option value="Accra">Accra</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Nairobi">Nairobi</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {errors.city && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Country</label>
              <div className="relative">
                <select
                  {...register('country')}
                  className={`${inputBaseClass} appearance-none cursor-pointer`}>
                  <option value="Africa">Africa</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Nigeria">Nigeria</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              {errors.country && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                {...register('email')}
                placeholder="kwame@djkwamebeats.com"
                className={inputBaseClass}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Phone</label>
              <input
                {...register('phone')}
                placeholder="+233 55 123 4567"
                className={inputBaseClass}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Two Cards - Changed from xl:grid-cols-2 to lg:grid-cols-2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Section 2: Music Genres */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 h-full">
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

          {/* Section 3: Password */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 h-full">
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Current password</label>
                <input
                  type="password"
                  {...register('currentPassword')}
                  placeholder="Enter your current password"
                  className={inputBaseClass}
                />
                {errors.currentPassword && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>New password</label>
                <input
                  type="password"
                  {...register('newPassword')}
                  placeholder="Enter your new password"
                  className={inputBaseClass}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            paddingTop: '1.5rem',
          }}>
          <Button
            size={'lg'}
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-3 px-10 rounded-md shadow-md transition-all active:scale-95 disabled:opacity-70"
            style={{width: 'auto', marginLeft: 'auto'}}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
