export interface AfricanTimezone {
  country: string;
  code: string;
  label: string;
  iana: string;
  city: string;
}

export const AFRICAN_TIMEZONES: AfricanTimezone[] = [
  { country: 'Kenya', code: 'EAT', label: 'EAT - East Africa (Nairobi, UTC+3)', iana: 'Africa/Nairobi', city: 'Nairobi' },
  { country: 'Uganda', code: 'EAT', label: 'EAT - East Africa (Kampala, UTC+3)', iana: 'Africa/Kampala', city: 'Kampala' },
  { country: 'Tanzania', code: 'EAT', label: 'EAT - East Africa (Dar es Salaam, UTC+3)', iana: 'Africa/Dar_es_Salaam', city: 'Dar es Salaam' },
  { country: 'Rwanda', code: 'CAT', label: 'CAT - Central Africa (Kigali, UTC+2)', iana: 'Africa/Kigali', city: 'Kigali' },
  { country: 'Nigeria', code: 'WAT', label: 'WAT - West Africa (Lagos, UTC+1)', iana: 'Africa/Lagos', city: 'Lagos' },
  { country: 'Ghana', code: 'GMT', label: 'GMT - Greenwich (Accra, UTC+0)', iana: 'Africa/Accra', city: 'Accra' },
  { country: 'South Africa', code: 'SAST', label: 'SAST - South Africa (Johannesburg, UTC+2)', iana: 'Africa/Johannesburg', city: 'Johannesburg' },
  { country: 'Egypt', code: 'EEST', label: 'EEST - North Africa (Cairo, UTC+2)', iana: 'Africa/Cairo', city: 'Cairo' },
  { country: 'Morocco', code: 'WEST', label: 'WEST - North Africa (Casablanca, UTC+1)', iana: 'Africa/Casablanca', city: 'Casablanca' },
  { country: 'Ethiopia', code: 'EAT', label: 'EAT - East Africa (Addis Ababa, UTC+3)', iana: 'Africa/Addis_Ababa', city: 'Addis Ababa' },
];

export interface WorldTimezoneOption {
  iana: string;
  label: string;
  group: string;
}

export const POPULAR_WORLD_TIMEZONES: WorldTimezoneOption[] = [
  // Africa
  { iana: 'Africa/Nairobi', label: 'Nairobi, Kenya (EAT / UTC+3)', group: 'Africa' },
  { iana: 'Africa/Lagos', label: 'Lagos, Nigeria (WAT / UTC+1)', group: 'Africa' },
  { iana: 'Africa/Johannesburg', label: 'Johannesburg, South Africa (SAST / UTC+2)', group: 'Africa' },
  { iana: 'Africa/Accra', label: 'Accra, Ghana (GMT / UTC+0)', group: 'Africa' },
  { iana: 'Africa/Kampala', label: 'Kampala, Uganda (EAT / UTC+3)', group: 'Africa' },
  { iana: 'Africa/Dar_es_Salaam', label: 'Dar es Salaam, Tanzania (EAT / UTC+3)', group: 'Africa' },
  { iana: 'Africa/Kigali', label: 'Kigali, Rwanda (CAT / UTC+2)', group: 'Africa' },
  { iana: 'Africa/Cairo', label: 'Cairo, Egypt (UTC+2)', group: 'Africa' },
  { iana: 'Africa/Casablanca', label: 'Casablanca, Morocco (UTC+1)', group: 'Africa' },
  { iana: 'Africa/Addis_Ababa', label: 'Addis Ababa, Ethiopia (EAT / UTC+3)', group: 'Africa' },

  // Europe & UK
  { iana: 'Europe/London', label: 'London, UK (GMT/BST / UTC+0/+1)', group: 'Europe' },
  { iana: 'Europe/Paris', label: 'Paris, France (CET / UTC+1/+2)', group: 'Europe' },
  { iana: 'Europe/Berlin', label: 'Berlin, Germany (CET / UTC+1/+2)', group: 'Europe' },
  { iana: 'Europe/Amsterdam', label: 'Amsterdam, Netherlands (CET / UTC+1/+2)', group: 'Europe' },

  // Asia & Middle East
  { iana: 'Asia/Dubai', label: 'Dubai, UAE (GST / UTC+4)', group: 'Asia & Middle East' },
  { iana: 'Asia/Dhaka', label: 'Dhaka, Bangladesh (BST / UTC+6)', group: 'Asia & Middle East' },
  { iana: 'Asia/Kolkata', label: 'Kolkata, India (IST / UTC+5:30)', group: 'Asia & Middle East' },
  { iana: 'Asia/Singapore', label: 'Singapore (SGT / UTC+8)', group: 'Asia & Middle East' },
  { iana: 'Asia/Tokyo', label: 'Tokyo, Japan (JST / UTC+9)', group: 'Asia & Middle East' },
  { iana: 'Asia/Riyadh', label: 'Riyadh, Saudi Arabia (AST / UTC+3)', group: 'Asia & Middle East' },

  // Americas
  { iana: 'America/New_York', label: 'New York, USA (EST/EDT / UTC-5/-4)', group: 'Americas' },
  { iana: 'America/Chicago', label: 'Chicago, USA (CST/CDT / UTC-6/-5)', group: 'Americas' },
  { iana: 'America/Los_Angeles', label: 'Los Angeles, USA (PST/PDT / UTC-8/-7)', group: 'Americas' },
  { iana: 'America/Toronto', label: 'Toronto, Canada (EST/EDT / UTC-5/-4)', group: 'Americas' },

  // Global standard
  { iana: 'UTC', label: 'Coordinated Universal Time (UTC)', group: 'Universal' },
];

export function getCountryTimezone(countryOrAddress?: string): AfricanTimezone {
  if (!countryOrAddress) return AFRICAN_TIMEZONES[0];
  const query = countryOrAddress.toLowerCase();

  if (query.includes('uganda') || query.includes('kampala')) {
    return AFRICAN_TIMEZONES[1]; // Uganda
  }
  if (query.includes('tanzania') || query.includes('dar es salaam') || query.includes('zanzibar')) {
    return AFRICAN_TIMEZONES[2]; // Tanzania
  }
  if (query.includes('rwanda') || query.includes('kigali')) {
    return AFRICAN_TIMEZONES[3]; // Rwanda
  }
  if (query.includes('nigeria') || query.includes('lagos') || query.includes('abuja') || query.includes('wat')) {
    return AFRICAN_TIMEZONES[4]; // Nigeria
  }
  if (query.includes('ghana') || query.includes('accra') || query.includes('gmt')) {
    return AFRICAN_TIMEZONES[5]; // Ghana
  }
  if (query.includes('south africa') || query.includes('johannesburg') || query.includes('cape town') || query.includes('sast')) {
    return AFRICAN_TIMEZONES[6]; // South Africa
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

export function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Nairobi';
  } catch {
    return 'Africa/Nairobi';
  }
}

export function formatDateInTz(
  dateInput: Date | string | null | undefined,
  timeZone: string = 'Africa/Nairobi',
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateInput) return 'N/A';
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-US', {
      timeZone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      ...options,
    });
  } catch {
    return String(dateInput);
  }
}

export function formatTimeInTz(
  dateInput: Date | string | null | undefined,
  timeZone: string = 'Africa/Nairobi',
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateInput) return '';
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-US', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true, // explicit 12-hour AM/PM
      ...options,
    });
  } catch {
    return '';
  }
}
