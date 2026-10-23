'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from 'react-hook-form';
import { Country, City } from 'country-state-city';
import { Check, ChevronsUpDown } from 'lucide-react';
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
import { POPULAR_WORLD_TIMEZONES } from '@/lib/timezone';
import { SUPPORTED_CURRENCIES, getCurrencyForCountry } from '@/lib/currency';
import { ProfileFormValues, inputBaseClass, labelClass } from './profile.schema';

interface PersonalDetailsSectionProps {
  register: UseFormRegister<ProfileFormValues>;
  watch: UseFormWatch<ProfileFormValues>;
  setValue: UseFormSetValue<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
}

export function PersonalDetailsSection({
  register,
  watch,
  setValue,
  errors,
}: PersonalDetailsSectionProps) {
  const [countries] = useState(Country.getAllCountries());
  const [countryOpen, setCountryOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const selectedCountry = watch('country');
  const currentCity = watch('city');
  const currentCurrency = watch('currencyCode');

  // Derive cities directly without triggering cascading render effect
  const cities = useMemo(() => {
    if (!selectedCountry) return [];
    return City.getCitiesOfCountry(selectedCountry) || [];
  }, [selectedCountry]);



  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 md:p-8">
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
            <span className="bg-gray-100 border border-transparent border-l-gray-200 px-4 py-3 text-sm text-gray-500 rounded-r-sm font-medium">
              .deejay.africa
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
            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
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

              <PopoverContent
                id="country-options"
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start">
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
                            if (country.isoCode !== selectedCountry) {
                              setValue('country', country.isoCode, {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                              setValue('city', '', {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                              // Auto-suggest currency if not manually customized
                              const suggestedCurrency = getCurrencyForCountry(country.isoCode);
                              if (suggestedCurrency) {
                                setValue('currencyCode', suggestedCurrency, { shouldDirty: true });
                              }
                            }
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
                  {currentCity || (
                    <span className="text-gray-400">Select City</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                id="city-options"
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start">
                <Command>
                  <CommandInput placeholder="Search city..." />
                  <CommandList>
                    <CommandEmpty>
                      {selectedCountry
                        ? 'No city found.'
                        : 'Select a country first.'}
                    </CommandEmpty>
                    <CommandGroup>
                      {cities.map((city) => (
                        <CommandItem
                          key={`${city.name}-${city.latitude}`}
                          value={city.name}
                          onSelect={() => {
                            setValue('city', city.name, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            setCityOpen(false);
                          }}>
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              currentCity === city.name
                                ? 'opacity-100'
                                : 'opacity-0',
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
            <p className="text-red-500 text-xs mt-1.5">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Operating Timezone</label>
          <select {...register('timezone')} className={inputBaseClass}>
            {Array.from(
              new Set(POPULAR_WORLD_TIMEZONES.map((t) => t.group)),
            ).map((groupName) => (
              <optgroup key={groupName} label={groupName}>
                {POPULAR_WORLD_TIMEZONES.filter(
                  (t) => t.group === groupName,
                ).map((tz) => (
                  <option key={tz.iana} value={tz.iana}>
                    {tz.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="text-gray-400 text-xs mt-1">
            Client bookings convert seamlessly into this timezone for your
            calendar and dashboard.
          </p>
        </div>

        <div>
          <label className={labelClass}>Operating Currency</label>
          <select
            {...register('currencyCode')}
            className={inputBaseClass}>
            {(() => {
              const exists = SUPPORTED_CURRENCIES.some(
                (c) => c.code === currentCurrency,
              );
              return (
                <>
                  {currentCurrency && !exists && (
                    <option value={currentCurrency}>
                      {currentCurrency} (Custom)
                    </option>
                  )}
                  {Array.from(
                    new Set(SUPPORTED_CURRENCIES.map((c) => c.group)),
                  ).map((groupName) => (
                    <optgroup key={groupName} label={groupName}>
                      {SUPPORTED_CURRENCIES.filter(
                        (c) => c.group === groupName,
                      ).map((curr) => (
                        <option key={curr.code} value={curr.code}>
                          {curr.code} ({curr.symbol}) — {curr.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </>
              );
            })()}
          </select>
          <p className="text-gray-400 text-xs mt-1">
            Auto-selected from your country. All quotes and direct payment
            requests default to this currency.
          </p>
        </div>
      </div>
    </div>
  );
}
