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
  currencyCode?: string;
  isActive?: boolean;
  socialLinks?: any;
  config?: any;
  directPaymentInstructions?: Record<string, any> | null;
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
  bookingReviews?: BookingReview[];
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

export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'AWAITING_PAYMENT'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'NO_SHOW'
  | 'DISPUTED'
  | 'pending'
  | 'accepted'
  | 'completed'
  | 'canceled'
  | 'rejected'
  | string;

export type DirectPaymentStatus =
  | 'UNREPORTED'
  | 'CLIENT_REPORTED'
  | 'DJ_CONFIRMED'
  | string;

export interface BookingQuote {
  id: string;
  bookingId: string;
  version: number;
  amount: number | string;
  currency: string;
  proposedBy: 'DJ' | 'CLIENT' | string;
  status: 'PROPOSED' | 'ACCEPTED' | 'REJECTED' | 'SUPERSEDED' | string;
  notes?: string | null;
  message?: string | null;
  createdAt?: string;
  acceptedAt?: string | null;
}

export interface BookingMessage {
  id: string;
  bookingId: string;
  senderType: 'DJ' | 'CLIENT' | string;
  senderId?: string | null;
  content: string;
  createdAt: string;
}

export interface BookingAgreement {
  id: string;
  bookingId: string;
  quoteId?: string | null;
  agreedAmount: number | string;
  currency: string;
  termsSnapshot?: Record<string, any> | null;
  acceptedByParty?: string | null;
  acceptedBy?: string | null;
  clientAcceptedAt?: string | null;
  djAcceptedAt?: string | null;
  createdAt: string;
}

export interface BookingAuditEvent {
  id: string;
  bookingId: string;
  actorType: string;
  actorId?: string | null;
  eventType: string;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface BookingReview {
  id: string;
  bookingId: string;
  tenantId?: string | null;
  rating: number;
  reviewText?: string | null;
  comment?: string | null;
  clientName?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface DjScheduleData {
  today: Booking[];
  tomorrow: Booking[];
  upcoming: Booking[];
  past: Booking[];
  needsAction: Booking[];
}

export type PaymentStatus =
  | 'UNPAID'
  | 'PENDING'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'REFUNDED'
  | 'FAILED'
  | string;

export type PayoutStatus =
  | 'NOT_APPLICABLE'
  | 'PENDING_EVENT'
  | 'ESCROW_HELD'
  | 'PAYOUT_REQUESTED'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'DISPUTED'
  | string;

export interface Booking {
  id: string;
  tenantId?: string;
  clientId?: string;
  orderReference?: string;
  directPaymentStatus?: DirectPaymentStatus;
  eventType?: string;
  eventDetails?: string | Record<string, any> | null;
  eventDate?: string | null;
  eventTimezone?: string | null;
  currencyCode?: string;
  currency?: string;
  address?: string | null;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  payoutStatus?: PayoutStatus;
  totalAmount?: number | string;
  grossAmount?: number | string;
  djNetEarning?: number | string;
  paymentMethod?: string;
  paymentDueAt?: string;
  createdAt?: string;
  updatedAt?: string;
  confirmedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  completionRequestedAt?: string | null;
  completionConfirmedAt?: string | null;
  issueReportedAt?: string | null;
  issueDescription?: string | null;
  deletedAt?: string;

  tenant?: Tenant;
  client?: Client;
  invoice?: Invoice;
  quotes?: BookingQuote[];
  messages?: BookingMessage[];
  agreement?: BookingAgreement | null;
  review?: BookingReview | null;
  paymentInstructions?: Record<string, any> | null;
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

export interface InvoiceClient {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface InvoiceBooking {
  id: string;
  eventType?: string | null;
  eventDate?: string | null;
  address?: string | null;
  client?: InvoiceClient | null;
}

export interface InvoiceTenantUser {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

export interface InvoiceTenant {
  stageName?: string | null;
  city?: string | null;
  country?: string | null;
  subdomain?: string | null;
  user?: InvoiceTenantUser | null;
}

export interface InvoiceUser {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
}

export interface InvoicePlan {
  name?: string | null;
}

export interface Invoice {
  id: string;
  type: 'SUBSCRIPTION' | 'BOOKING';
  status: 'UNPAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  amount: number | string;
  currencyCode?: string;
  createdAt?: string;
  updatedAt?: string;
  dueDate?: string | null;

  // Gateway and Method
  gateway?: 'PAYSTACK' | 'PESAPAL' | 'FLUTTERWAVE' | 'DPO' | 'CELLULANT' | 'CASH' | 'MANUAL' | string | null;
  method?: 'CARD' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'USSD' | 'CASH' | 'UNKNOWN' | string | null;
  cardBrand?: string | null;
  cardLast4?: string | null;
  paidAt?: string | null;

  user?: InvoiceUser | null;
  tenant?: InvoiceTenant | null;
  booking?: InvoiceBooking | null;
  plan?: InvoicePlan | null;
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  invoiceId: string;
  tenantId?: string;
  userId?: string;
  amount: number | string;
  grossAmount?: number | string;
  platformFee?: number | string;
  gatewayFee?: number | string;
  djNetEarning?: number | string;
  refundedAmount?: number | string;
  remainingAmount?: number | string;
  currency?: string;
  gateway: 'PAYSTACK' | 'PESAPAL' | 'FLUTTERWAVE' | 'STRIPE' | 'CASH' | 'MANUAL';
  channel: 'CARD' | 'BANK_TRANSFER' | 'USSD' | 'MOBILE_MONEY' | 'CASH' | 'UNKNOWN';
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
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

export interface LandingPageSetting {
  id?: number;
  headerLogoUrl: string | null;
  footerLogoUrl: string | null;
  siteName?: string | null;
  updatedAt?: string;
}

export interface LandingPageContent {
  hero: LandingPageHero | null;
  steps: LandingPageStep[];
  services: LandingPageService[];
  faqs: LandingPageFaq[];
  socials: LandingPageSocial[];
  settings?: LandingPageSetting | null;
}

