export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  DJ = 'DJ',
}

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  profileImg?: string;
  isVerified?: boolean;
  otp?: string;
  otpExpiry?: string;
  createdAt?: string;
  updatedAt?: string;

  tenant?: Tenant;
  subscriptions?: Subscription[];
  invoices?: Invoice[];
  transactions?: Transaction[];
  auditLogs?: AuditLog[];
  supportTickets?: SupportTicket[];
  notifications?: Notification[];
}

export interface Theme {
  id: number;
  name?: string;
  slug?: string;
  previewImageUrl?: string;
  defaultConfig?: any;
  createdAt?: string;
  updatedAt?: string;

  tenants?: Tenant[];
}

export interface Tenant {
  id: string;
  userId?: string;
  subdomain?: string;
  stageName?: string;
  country?: string;
  city?: string;
  genres?: any;
  themeId?: number;
  logoUrl?: string;
  bio?: string;
  timezone?: string;
  isActive?: boolean;
  socialLinks?: any;
  config?: any;
  stripeAccountId?: string;
  activePlanId?: number;
  subscriptionStatus?: 'active' | 'past_due' | 'canceled';
  createdAt?: string;
  updatedAt?: string;

  user?: User;
  theme?: Theme;
  mixTapes?: MixTape[];
  events?: Event[];
  bookings?: Booking[];
  clients?: Client[];
  invoices?: Invoice[];
}

export interface SubscriptionPlan {
  id: number;
  name?: string;
  priceMonthly?: number | string;
  priceAnnually?: number | string;
  stripeMonthlyPriceId?: string;
  stripeAnnualPriceId?: string;
  discountPercentage?: number;
  features?: any;
  createdAt?: string;
  updatedAt?: string;

  subscriptions?: Subscription[];
}

export interface Subscription {
  id: string;
  userId?: string;
  planId?: number;
  stripeSubId?: string;
  status?: 'active' | 'past_due' | 'canceled';
  periodEnd?: string;
  createdAt?: string;
  updatedAt?: string;

  user?: User;
  plan?: SubscriptionPlan;
}

export interface MixTape {
  id: string;
  tenantId?: string;
  title?: string;
  audioUrl?: string;
  coverUrl?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;

  tenant?: Tenant;
}

export interface Event {
  id: string;
  tenantId?: string;
  title?: string;
  description?: string;
  eventDate?: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  capacity?: number;
  price?: number | string;
  status?: 'upcoming' | 'completed' | 'canceled';
  coverUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;

  tenant?: Tenant;
}

export interface Booking {
  id: string;
  tenantId?: string;
  clientId?: string;
  eventType?: string;
  eventDetails?: string;
  eventDate?: string;
  address?: string;
  status?: 'pending' | 'accepted' | 'completed';
  totalAmount?: number | string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;

  tenant?: Tenant;
  client?: Client;
  invoice?: Invoice;
}

export interface Client {
  id: string;
  tenantId?: string;
  name?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;

  tenant?: Tenant;
  bookings?: Booking[];
}

export interface Invoice {
  id: string;
  userId?: string;
  tenantId?: string;
  bookingId?: string;
  planId?: number;
  amount?: number | string;
  status: 'UNPAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  type: 'SUBSCRIPTION' | 'BOOKING';
  createdAt?: string;
  updatedAt?: string;

  user?: User;
  tenant?: Tenant;
  booking?: Booking;
  plan?: SubscriptionPlan;
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  invoiceId: string;
  tenantId?: string;
  userId?: string;
  amount: number | string;
  gateway: 'PAYSTACK' | 'STRIPE' | 'MANUAL';
  channel: 'CARD' | 'BANK_TRANSFER' | 'USSD' | 'MOBILE_MONEY' | 'CASH';
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  gatewayReference?: string;
  cardBrand?: string;
  cardLast4?: string;
  bankName?: string;
  accountName?: string;
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;

  invoice?: Invoice;
  tenant?: Tenant;
  user?: User;
}

export interface WebhookEvent {
  id: string;
  gatewayEventId: string;
  type?: string;
  status?: string;
  createdAt?: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action?: string;
  metadata?: any;
  ipAddress?: string;
  createdAt?: string;

  user?: User;
}

export interface SupportTicket {
  id: string;
  userId?: string;
  fullName?: string;
  email?: string;
  subject?: string;
  issue?: string;
  status?: 'open' | 'in_progress' | 'resolved';
  createdAt?: string;

  user?: User;
}

export interface Notification {
  id: string;
  userId?: string;
  title?: string;
  message?: string;
  type?: 'booking_request' | 'payment' | 'system';
  isRead?: boolean;
  referenceId?: string;
  createdAt?: string;

  user?: User;
}

export interface LandingPageHero {
  id: number;
  title: string | null;
  description: string | null;
  imageUrl1: string | null;
  imageUrl2: string | null;
  imageUrl3: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LandingPageStep {
  id: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  order?: number;
}

export interface LandingPageService {
  id: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  order?: number;
}

export interface LandingPageFaq {
  id: number;
  question?: string;
  answer?: string;
  order?: number;
}

export interface LandingPageSocial {
  id: number;
  platform: string;
  url: string;
  icon?: string;
  isActive: boolean;
  order?: number;
}

export interface LandingPageContent {
  hero: LandingPageHero | null;
  steps: LandingPageStep[];
  services: LandingPageService[];
  faqs: LandingPageFaq[];
  socials: LandingPageSocial[];
}
