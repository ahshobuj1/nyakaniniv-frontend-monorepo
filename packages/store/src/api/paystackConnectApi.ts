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
      invalidatesTags: ['PaystackConnect'],
    }),
    checkAccountStatus: builder.query<BaseResponse<PaystackStatusResponse>, string>({
      query: (tenantId) => ({
        url: `/paystack-connect/v1/status?tenantId=${tenantId}`,
        method: 'GET',
      }),
      providesTags: ['PaystackConnect'],
    }),
    getBanks: builder.query<BaseResponse<PaystackBank[]>, string>({
      query: (country) => ({
        url: `/paystack-connect/v1/banks?country=${country}`,
        method: 'GET',
      }),
    }),
    disconnectAccount: builder.mutation<BaseResponse<void>, { tenantId: string }>({
      query: (body) => ({
        url: `/paystack-connect/v1/disconnect`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['PaystackConnect'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOnboardingLinkMutation: useGetPaystackOnboardingLinkMutation,
  useCheckAccountStatusQuery: useCheckPaystackAccountStatusQuery,
  useGetBanksQuery: useGetPaystackBanksQuery,
  useDisconnectAccountMutation: useDisconnectPaystackAccountMutation,
} = paystackConnectApi;
