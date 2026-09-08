import { baseApi } from './baseApi';
import { SubscriptionPlan, Subscription, BaseResponse, SubscribeRequest, SubscribeResponse } from '../types';

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<BaseResponse<SubscriptionPlan[]>, void>({
      query: () => ({
        url: '/subscriptions/v1/plans',
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),
    getMySubscription: builder.query<BaseResponse<Subscription>, void>({
      query: () => ({
        url: '/subscriptions/v1/my-subscription',
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),
    subscribe: builder.mutation<BaseResponse<SubscribeResponse>, SubscribeRequest>({
      query: (body) => ({
        url: '/subscriptions/v1/subscribe',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),
    cancelSubscription: builder.mutation<BaseResponse<null>, void>({
      query: () => ({
        url: '/subscriptions/v1/cancel',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
    getAvailableGateways: builder.query<BaseResponse<Array<{
      id: string;
      name: string;
      title: string;
      description: string;
      currencies: string[];
      isRecommended: boolean;
      badge: string;
      paymentMethods: string[];
    }>>, string | void>({
      query: (country) => ({
        url: `/subscriptions/v1/gateways${country ? `?country=${country}` : ''}`,
        method: 'GET',
      }),
    }),
    validatePayoutAccount: builder.mutation<BaseResponse<{ valid: boolean; accountName?: string; message?: string }>, {
      gateway: string;
      bankCode?: string;
      accountNumber: string;
      country?: string;
    }>({
      query: (body) => ({
        url: '/subscriptions/v1/validate-payout',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPlansQuery,
  useGetMySubscriptionQuery,
  useSubscribeMutation,
  useCancelSubscriptionMutation,
  useGetAvailableGatewaysQuery,
  useValidatePayoutAccountMutation,
} = subscriptionApi;
