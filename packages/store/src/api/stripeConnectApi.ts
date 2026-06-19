import { baseApi } from './baseApi';
import { BaseResponse, StripeOnboardRequest, StripeOnboardResponse, StripeStatusResponse } from '../types';

export const stripeConnectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardingLink: builder.mutation<BaseResponse<StripeOnboardResponse>, StripeOnboardRequest>({
      query: (body) => ({
        url: '/stripe-connect/v1/onboard',
        method: 'POST',
        body,
      }),
    }),
    checkAccountStatus: builder.query<BaseResponse<StripeStatusResponse>, string>({
      query: (tenantId) => ({
        url: `/stripe-connect/v1/status?tenantId=${tenantId}`,
        method: 'GET',
      }),
      providesTags: ['StripeConnect'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOnboardingLinkMutation,
  useCheckAccountStatusQuery,
} = stripeConnectApi;
