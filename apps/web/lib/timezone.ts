export interface AfricanTimezone {
  country: string;
  code: string;
  label: string;
  iana: string;
  city: string;
}

export const AFRICAN_TIMEZONES: AfricanTimezone[] = [
  { country: 'Kenya', code: 'EAT', label: 'EAT - East Africa (Nairobi, UTC+3)', iana: 'Africa/Nairobi', city: 'Nairobi' },
  { country: 'Nigeria', code: 'WAT', label: 'WAT - West Africa (Lagos, UTC+1)', iana: 'Africa/Lagos', city: 'Lagos' },
  { country: 'Ghana', code: 'GMT', label: 'GMT - Greenwich (Accra, UTC+0)', iana: 'Africa/Accra', city: 'Accra' },
  { country: 'South Africa', code: 'SAST', label: 'SAST - South Africa (Johannesburg, UTC+2)', iana: 'Africa/Johannesburg', city: 'Johannesburg' },
];

export function getCountryTimezone(countryOrAddress?: string): AfricanTimezone {
  if (!countryOrAddress) return AFRICAN_TIMEZONES[0];
  const query = countryOrAddress.toLowerCase();

  if (query.includes('nigeria') || query.includes('lagos') || query.includes('abuja') || query.includes('wat')) {
    return AFRICAN_TIMEZONES[1]; // Nigeria
  }
  if (query.includes('ghana') || query.includes('accra') || query.includes('gmt')) {
    return AFRICAN_TIMEZONES[2]; // Ghana
  }
  if (query.includes('south africa') || query.includes('johannesburg') || query.includes('cape town') || query.includes('sast')) {
    return AFRICAN_TIMEZONES[3]; // South Africa
  }
  return AFRICAN_TIMEZONES[0]; // Kenya (Default)
}

export function formatEventTimeWithZone(time?: string, countryOrLocation?: string): string {
  if (!time) return '';
  const tz = getCountryTimezone(countryOrLocation);
  
  // If time already contains a timezone abbreviation, keep it
  if (time.includes('EAT') || time.includes('WAT') || time.includes('GMT') || time.includes('SAST') || time.includes('UTC')) {
    return time;
  }
  
  return `${time} ${tz.code}`;
}
