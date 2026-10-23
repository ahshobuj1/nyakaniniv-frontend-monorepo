import * as z from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  stageName: z.string().min(1, 'Stage name is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  timezone: z.string().optional(),
  currencyCode: z.string().optional(),
  email: z.string().email('Invalid email address'),
  subdomain: z.string().optional(),
  genres: z.array(z.string()).max(4, 'You can select a maximum of 4 genres'),
  socialLinks: z
    .object({
      instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
      facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
      linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
    })
    .optional(),
  profileImage: z.custom<File | undefined>().optional(),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const paymentInstructionsSchema = z.object({
  enabled: z.boolean(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mobileMoneyProvider: z.string().optional(),
  mobileMoneyNumber: z.string().optional(),
  instructions: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;
export type PaymentInstructionsFormValues = z.infer<typeof paymentInstructionsSchema>;

export const ALL_GENRES = [
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

export const inputBaseClass =
  'w-full bg-[#f8fafc] border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all';
export const labelClass = 'block text-xs font-bold text-gray-700 mb-2';
