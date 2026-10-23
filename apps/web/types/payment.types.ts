export type PaymentGatewayId = 'PAYSTACK' | 'PESAPAL' | 'FLUTTERWAVE';

export type PaymentMethodBadgeId =
  | 'MPESA'
  | 'AIRTEL'
  | 'TIGO'
  | 'MTN'
  | 'VISA'
  | 'MASTERCARD'
  | 'APPLE_PAY'
  | 'BANK_TRANSFER'
  | 'VERVE';

export interface PayoutCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
}

export interface PayoutGatewayOption {
  id: PaymentGatewayId;
  name: string;
  headline: string;
  description: string;
  recommendedFor: string[];
}

export interface GatewayCardOption {
  id: string;
  name: string;
  title: string;
  description: string;
  badge?: string;
  currencies: string[];
  isRecommended?: boolean;
  paymentMethods: string[];
}

export interface CheckoutGatewayChoice {
  id: PaymentGatewayId;
  name: string;
  badge: string;
  tagline: string;
  paymentMethods: string[];
  description: string;
  supportedCurrencies: string;
}

export interface GatewaySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGateway: (gateway: string) => Promise<void>;
  planName?: string;
  price?: number;
  billingCycle?: 'monthly' | 'annually';
  currency?: string;
  tenantCountry?: string;
  isLoading?: boolean;
  isUpgrade?: boolean;
  currentPlanName?: string;
  remainingDays?: number;
  unusedCredit?: number;
  amountToPay?: number;
  isDowngrade?: boolean;
  downgradeMessage?: string | null;
  onInstantUpgrade?: () => Promise<void>;
}

export interface ConnectPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  defaultCountry?: string;
  defaultStageName?: string;
  isConnected?: boolean;
  onDisconnect?: () => void;
  onSuccess?: () => void;
}
