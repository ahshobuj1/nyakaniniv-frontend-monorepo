/* eslint-disable react-hooks/incompatible-library */
'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {toast} from 'sonner';
import {ChevronDown} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@repo/ui';

const profileSchema = z.object({
  country: z.string().min(1, 'Please select a country'),
  city: z.string().min(1, 'Please select a city'),
  genres: z
    .array(z.string())
    .min(1, 'Please select at least one genre')
    .max(4, 'You can select up to 4 genres'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const availableGenres = [
  'Reggaeton',
  'K-Pop',
  'Indie Rock',
  'Jazz Fusion',
  'Electronic Dance Music',
  'Alternative R&B',
  'Country Pop',
  'Progressive House',
  'Classic Rock',
  'Funk',
  'Psychedelic Rock',
  'Ska',
];

export default function SetupProfilePage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {errors, isSubmitting},
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      country: '',
      city: '',
      genres: [],
    },
  });

  const selectedGenres = watch('genres') || [];

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setValue(
        'genres',
        selectedGenres.filter((g) => g !== genre),
        {shouldValidate: true},
      );
    } else if (selectedGenres.length < 4) {
      setValue('genres', [...selectedGenres, genre], {shouldValidate: true});
    } else {
      toast.error('You can only select up to 4 genres');
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    console.log(data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Profile setup complete!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full md:max-w-150">
        <div className="flex flex-col items-center mb-6">
          <Link className="rounded-md p-2 hover:bg-muted/50 py-4" href="/">
            <Image
              src={'/auth.logo.png'}
              width={500}
              height={500}
              alt="logo"
              className="max-w-30 bg-contain w-auto h-auto"
              priority
            />
          </Link>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-[32px] font-semibold text-gray-900 mb-2 tracking-tight">
            Set up your DJ profile
          </h2>
          <p className="text-gray-500 text-[15px]">
            This becomes your public identity on UpBeat
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="country"
                className="block text-[13px] font-bold text-gray-900 mb-2">
                Country
              </label>
              <div className="relative">
                <select
                  id="country"
                  className={`w-full px-4 py-3.5 bg-white text-sm text-gray-500 outline-none transition-all appearance-none ${
                    errors.country
                      ? 'border border-red-500'
                      : 'border border-transparent focus:border-gray-300 shadow-sm'
                  }`}
                  {...register('country')}>
                  <option value="" disabled hidden>
                    Select Country
                  </option>
                  <option value="NG">Nigeria</option>
                  <option value="ZA">South Africa</option>
                  <option value="KE">Kenya</option>
                  <option value="GH">Ghana</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                  <ChevronDown size={16} strokeWidth={2} />
                </div>
              </div>
              {errors.country && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-[13px] font-bold text-gray-900 mb-2">
                City
              </label>
              <div className="relative">
                <select
                  id="city"
                  className={`w-full px-4 py-3.5 bg-white text-sm text-gray-500 outline-none transition-all appearance-none ${
                    errors.city
                      ? 'border border-red-500'
                      : 'border border-transparent focus:border-gray-300 shadow-sm'
                  }`}
                  {...register('city')}>
                  <option value="" disabled hidden>
                    Select City
                  </option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Cape Town">Cape Town</option>
                  <option value="Johannesburg">Johannesburg</option>
                  <option value="Nairobi">Nairobi</option>
                  <option value="Accra">Accra</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                  <ChevronDown size={16} strokeWidth={2} />
                </div>
              </div>
              {errors.city && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-gray-900 mb-3">
              Your Genres (pick up to 4)
            </label>
            <div className="flex flex-wrap gap-2.5">
              {availableGenres.map((genre) => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-4 py-2 cursor-pointer hover:text-primary rounded-full text-[13px] transition-colors ${
                      isSelected
                        ? 'bg-red-50 text-primary border border-primary'
                        : 'bg-white text-gray-500 border border-transparent hover:border-gray-200 shadow-sm'
                    }`}>
                    {genre}
                  </button>
                );
              })}
            </div>
            {errors.genres && (
              <p className="text-red-500 text-xs mt-2">
                {errors.genres.message}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <Link href={'/'} className="w-1/2">
              <Button
                type="button"
                className="w-full border-2 rounded-none border-gray-700 text-gray-900 bg-transparent py-6 text-lg font-medium hover:bg-gray-100 transition-colors">
                Back
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 bg-primary rounded-none text-white py-6 border-primary text-lg font-medium hover:bg-[#e03939] border-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm">
              {isSubmitting ? 'Processing...' : 'Continue'}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-[14px] text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
