import { User, Tenant, Theme, Event, MixTape, Booking, SubscriptionPlan, Subscription, Client, Notification, LandingPageContent } from './models.types';

// --- Auth Requests ---
export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword?: string;
}

export interface ChangePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// --- User Requests ---
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  profileImage?: File | string;
}

// --- Tenant Requests ---
export interface OnboardTenantRequest {
  subdomain: string;
  stageName: string;
  country?: string;
  city?: string;
  genres?: string[];
}

export interface UpdateTenantProfileRequest {
  stageName?: string;
  country?: string;
  city?: string;
  timezone?: string;
  currencyCode?: string;
  genres?: string[];
  bio?: string;
  socialLinks?: Record<string, string>;
  logo?: File;
  banner?: File;
}

export interface AssignThemeRequest {
  themeSlug: string;
  config?: any;
}

// --- Event Requests ---
export interface CreateEventRequest {
  title: string;
  description?: string;
  eventDate: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  capacity?: number;
  price?: number;
  status?: string;
  coverImage?: File;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
}

// --- MixTape Requests ---
export interface CreateMixTapeRequest {
  title: string;
  audioUrl: string | File;
  coverImage?: File;
  order?: number;
}

export interface UpdateMixTapeRequest extends Partial<CreateMixTapeRequest> {
  id: string;
}

export interface ReorderMixTapesRequest {
  orders: { id: string; order: number }[];
}

// --- Booking Requests ---
export interface CreateBookingRequest {
  tenantId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  eventDate: string;
  eventType: string;
  eventDetails?: string;
  eventTimezone?: string;
  currencyCode?: string;
  address?: string;
}

export interface InitiateBookingResponse {
  verificationToken: string;
  clientEmail: string;
  expiresIn: number;
}

export interface VerifyBookingOtpRequest {
  verificationToken: string;
  otp: string;
}

export interface ResendBookingOtpRequest {
  verificationToken: string;
}

export interface UpdateBookingStatusRequest {
  id: string;
  status: string;
  totalAmount?: number;
  currencyCode?: string;
  cashBooking?: boolean;
  reason?: string;
}

// --- Booking Portal & Direct Payment Requests ---
export interface RequestBookingAccessOtpRequest {
  orderReference: string;
  email?: string;
}

export interface VerifyBookingAccessOtpRequest {
  sessionToken?: string;
  orderReference?: string;
  otp: string;
}

export interface ResendBookingAccessOtpRequest {
  sessionToken?: string;
  orderReference?: string;
}

export interface BookingAccessResponse {
  token?: string;
  bookingAccessToken?: string;
  bookingId: string;
  orderReference: string;
}

export interface SendBookingMessageRequest {
  id?: string;
  bookingId?: string;
  content: string;
}

export interface ProposeQuoteRequest {
  id?: string;
  bookingId?: string;
  amount: number;
  currency?: string;
  notes?: string;
  message?: string;
}

export interface AcceptQuoteRequest {
  id?: string;
  bookingId?: string;
  quoteId: string;
}

export interface RejectQuoteRequest {
  id?: string;
  bookingId?: string;
  quoteId: string;
  reason?: string;
}

export interface ReportDirectPaymentRequest {
  id: string;
  method: string;
  reference?: string;
  notes?: string;
}

export interface ReportIssueRequest {
  id: string;
  description?: string;
  issueDescription?: string;
}

export interface SubmitReviewRequest {
  id?: string;
  bookingId?: string;
  rating: number;
  reviewText?: string;
  comment?: string;
}

export interface UpdatePaymentInstructionsRequest {
  enabled?: boolean;
  isEnabled?: boolean;
  method?: string;
  displayName?: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  mobileMoneyProvider?: string;
  mobileMoneyNumber?: string;
  instructions?: string;
  notes?: string;
}

// --- Subscription Requests ---
export interface SubscribeRequest {
  planId: number;
  billingCycle: 'monthly' | 'annually';
  successUrl?: string;
  cancelUrl?: string;
  gateway?: string;
}

export interface SubscribeResponse {
  url: string;
}

// --- Paystack Connect Requests ---
export interface PaystackOnboardRequest {
  tenantId: string;
  bankCode: string;
  bankName?: string;
  accountNumber: string;
  accountName?: string;
  businessName?: string;
  country?: string;
  gateway?: string;
}

export interface PaystackOnboardResponse {
  success: boolean;
  subaccountCode: string;
  gateway?: string;
}

export interface PaystackStatusResponse {
  isConnected: boolean;
  gateway?: string;
  subaccountCode?: string;
  bankName?: string;
  accountNumber?: string;
}

export interface PaystackBank {
  name: string;
  code: string;
  id: number;
}

// --- Ticket Requests ---
export interface CreateTicketRequest {
  fullName: string;
  email: string;
  subject: string;
  issue: string;
}
