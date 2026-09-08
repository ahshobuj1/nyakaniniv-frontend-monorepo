import { baseApi } from './baseApi';
import { BaseResponse, PaystackOnboardRequest, PaystackOnboardResponse, PaystackStatusResponse, PaystackBank } from '../types';

export const paystackConnectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardingLink: builder.mutation<BaseResponse<PaystackOnboardResponse>, PaystackOnboardRequest>({
      query: (body) => ({
        url: '/paystack-connect/v1/onboard',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PaystackConnect', 'Wallet'],
    }),
    checkAccountStatus: builder.query<BaseResponse<PaystackStatusResponse>, string>({
      query: (tenantId) => ({
        url: `/paystack-connect/v1/status?tenantId=${tenantId}`,
        method: 'GET',
      }),
      providesTags: ['PaystackConnect'],
    }),
    getBanks: builder.query<BaseResponse<PaystackBank[]>, { country?: string; gateway?: string } | string>({
      query: (arg) => {
        const country = typeof arg === 'string' ? arg : arg?.country || 'nigeria';
        const gateway = typeof arg === 'string' ? undefined : arg?.gateway;
        return {
          url: `/paystack-connect/v1/banks?country=${country}${gateway ? `&gateway=${gateway}` : ''}`,
          method: 'GET',
        };
      },
    }),
    disconnectAccount: builder.mutation<BaseResponse<void>, { tenantId: string }>({
      query: (body) => ({
        url: `/paystack-connect/v1/disconnect`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['PaystackConnect', 'Wallet'],
    }),
    validateAccount: builder.mutation<BaseResponse<{ valid: boolean; accountName?: string; message?: string }>, { bankCode: string; accountNumber: string; country?: string; gateway?: string }>({
      query: (body) => ({
        url: `/paystack-connect/v1/validate`,
        method: 'POST',
        body,
      }),
    }),
    getPaystackOAuthUrl: builder.query<BaseResponse<{ url: string }>, string>({
      query: (tenantId) => ({
        url: `/paystack-connect/v1/oauth/url?tenantId=${tenantId}`,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOnboardingLinkMutation: useGetPaystackOnboardingLinkMutation,
  useCheckAccountStatusQuery: useCheckPaystackAccountStatusQuery,
  useGetBanksQuery: useGetPaystackBanksQuery,
  useDisconnectAccountMutation: useDisconnectPaystackAccountMutation,
  useValidateAccountMutation: useValidatePaystackAccountMutation,
  useGetPaystackOAuthUrlQuery,
  useLazyGetPaystackOAuthUrlQuery,
} = paystackConnectApi;
