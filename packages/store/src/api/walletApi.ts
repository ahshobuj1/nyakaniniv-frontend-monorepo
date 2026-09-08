import { baseApi } from './baseApi';
import { BaseResponse } from '../types';

export interface WalletData {
  wallet: {
    id: string;
    tenantId: string;
    pendingBalance: number;
    availableBalance: number;
    totalEarnings: number;
    totalWithdrawn: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
  };
  payoutRequests: Array<{
    id: string;
    amount: number;
    fee?: number;
    currency: string;
    gateway: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'SUCCEEDED' | 'FAILED' | 'REJECTED' | 'CANCELLED';
    transferReference?: string;
    recipientCode?: string;
    accountDetails: any;
    adminNote?: string;
    failureReason?: string;
    processedAt?: string;
    createdAt: string;
  }>;
  ledgers: Array<{
    id: string;
    bookingId?: string;
    paymentId?: string;
    transferId?: string;
    referenceId?: string;
    amount: number;
    currency: string;
    type: 'BOOKING_CREDIT_PENDING' | 'ESCROW_RELEASED' | 'WITHDRAWAL_REQUESTED' | 'WITHDRAWAL_COMPLETED' | 'WITHDRAWAL_FAILED_REVERSAL' | 'WITHDRAWAL_REJECTED' | 'REFUND_ADJUSTMENT';
    previousBalance?: number;
    newBalance?: number;
    status?: string;
    description: string;
    createdAt: string;
  }>;
  connectedAccount: {
    gateway: string;
    accountId?: string;
    subaccountId?: string;
    bankName?: string;
    accountName?: string;
    recipientCode?: string;
  } | null;
}

export interface FinancialBreakdownPreview {
  grossAmount: number;
  platformFeePercent: number;
  platformFee: number;
  gatewayFee: number;
  djNetEarning: number;
  currency: string;
  isGatewayFeeEstimated: boolean;
}

export const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyWallet: builder.query<BaseResponse<WalletData>, string>({
      query: (tenantId) => ({
        url: `/wallet/v1/me?tenantId=${tenantId}`,
        method: 'GET',
      }),
      providesTags: ['Wallet'],
    }),
    requestWithdrawal: builder.mutation<BaseResponse<any>, { tenantId: string; amount: number }>({
      query: (body) => ({
        url: '/wallet/v1/withdraw',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wallet'],
    }),
    getFinancialBreakdownPreview: builder.query<
      BaseResponse<FinancialBreakdownPreview>,
      { amount: number; currency?: string; country?: string }
    >({
      query: ({ amount, currency = 'KES', country = 'KE' }) => ({
        url: `/wallet/v1/breakdown?amount=${amount}&currency=${currency}&country=${country}`,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyWalletQuery,
  useLazyGetMyWalletQuery,
  useRequestWithdrawalMutation,
  useGetFinancialBreakdownPreviewQuery,
  useLazyGetFinancialBreakdownPreviewQuery,
} = walletApi;
