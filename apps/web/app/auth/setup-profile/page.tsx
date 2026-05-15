/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {toast} from 'sonner';
import {Check, ChevronsUpDown} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Button,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui';
import {Country, City} from 'country-state-city';
import {useEffect, useState} from 'react';

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

export default function SetupProfilePage() {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: {errors, isSubmitting},
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      country: 'KE',
      city: '',
      genres: [],
    },
  });
  
  const [countries] = useState(Country.getAllCountries());
  const selectedCountry = watch('country');
  const [cities, setCities] = useState<any[]>([]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

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
    if (selectedCountry) {
      const currentCity = watch('city');
      const countryCities = City.getCitiesOfCountry(selectedCountry);
      const cityExists = countryCities?.some(c => c.name === currentCity) ?? false;
      if (!cityExists) {
        setValue('city', '', { shouldValidate: true });
      }
    }
  }, [selectedCountry, setValue, watch]);

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
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      role="combobox"
                      aria-expanded={countryOpen}
                      aria-controls="country-setup-options"
                      className={`w-full flex items-center justify-between px-4 py-3.5 bg-white text-sm text-gray-900 outline-none transition-all appearance-none border ${
                        errors.country
                          ? 'border-red-500'
                          : 'border-transparent focus:border-gray-300 shadow-sm'
                      }`}>
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
                        <span className="text-gray-500">Select Country</span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent id="country-setup-options" className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
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
                                setValue('country', country.isoCode, {shouldValidate: true});
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
                <Popover open={cityOpen} onOpenChange={setCityOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      role="combobox"
                      aria-expanded={cityOpen}
                      aria-controls="city-setup-options"
                      className={`w-full flex items-center justify-between px-4 py-3.5 bg-white text-sm text-gray-900 outline-none transition-all appearance-none border ${
                        errors.city
                          ? 'border-red-500'
                          : 'border-transparent focus:border-gray-300 shadow-sm'
                      }`}>
                      {watch('city') || <span className="text-gray-500">Select City</span>}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent id="city-setup-options" className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
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
                                setValue('city', city.name, {shouldValidate: true});
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
