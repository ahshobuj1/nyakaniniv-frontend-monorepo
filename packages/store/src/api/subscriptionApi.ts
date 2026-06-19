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
  }),
  overrideExisting: false,
});

export const {
  useGetPlansQuery,
  useGetMySubscriptionQuery,
  useSubscribeMutation,
  useCancelSubscriptionMutation,
} = subscriptionApi;
