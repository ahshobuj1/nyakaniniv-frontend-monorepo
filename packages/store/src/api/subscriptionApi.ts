import {baseApi} from './baseApi';
import {
  SubscriptionPlan,
  Subscription,
  BaseResponse,
  SubscribeRequest,
  SubscribeResponse,
  UpgradePreviewResponse,
  CurrencyItem,
  SubscriptionPlanPrice,
  SetPlanPriceRequest,
} from '../types';

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<
      BaseResponse<SubscriptionPlan[]>,
      {currency?: string; all?: boolean} | string | void
    >({
      query: (arg) => {
        const currency = typeof arg === 'string' ? arg : arg?.currency;
        const all =
          typeof arg === 'object' && arg !== null ? arg.all : undefined;
        const queryParams = new URLSearchParams();
        if (currency) queryParams.append('currency', currency);
        if (all) queryParams.append('all', 'true');
        const qs = queryParams.toString();
        return {
          url: `/subscriptions/v1/plans${qs ? `?${qs}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Subscription'],
    }),
    getCurrencies: builder.query<BaseResponse<CurrencyItem[]>, void>({
      query: () => ({
        url: '/subscriptions/v1/currencies',
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),
    getPlanPrices: builder.query<BaseResponse<SubscriptionPlanPrice[]>, number>(
      {
        query: (planId) => ({
          url: `/subscriptions/v1/plans/${planId}/prices`,
          method: 'GET',
        }),
        providesTags: ['Subscription'],
      },
    ),
    setPlanPrice: builder.mutation<
      BaseResponse<SubscriptionPlanPrice>,
      {planId: number; currencyCode: string; body: SetPlanPriceRequest}
    >({
      query: ({planId, currencyCode, body}) => ({
        url: `/subscriptions/v1/plans/${planId}/prices/${currencyCode}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),
    toggleCurrency: builder.mutation<
      BaseResponse<CurrencyItem>,
      {code: string; isActive: boolean}
    >({
      query: ({code, isActive}) => ({
        url: `/subscriptions/v1/currencies/${code}`,
        method: 'PATCH',
        body: {isActive},
      }),
      invalidatesTags: ['Subscription'],
    }),
    getMySubscription: builder.query<BaseResponse<Subscription>, void>({
      query: () => ({
        url: '/subscriptions/v1/my-subscription',
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),
    previewUpgrade: builder.query<
      BaseResponse<UpgradePreviewResponse>,
      {planId: number; billingCycle: 'monthly' | 'annually'; currency?: string}
    >({
      query: ({planId, billingCycle, currency}) => {
        const queryParams = new URLSearchParams({
          planId: String(planId),
          billingCycle,
        });
        if (currency) queryParams.append('currency', currency);
        return {
          url: `/subscriptions/v1/preview-upgrade?${queryParams.toString()}`,
          method: 'GET',
        };
      },
    }),
    subscribe: builder.mutation<
      BaseResponse<SubscribeResponse>,
      SubscribeRequest
    >({
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
    getAvailableGateways: builder.query<
      BaseResponse<
        Array<{
          id: string;
          name: string;
          title: string;
          description: string;
          currencies: string[];
          isRecommended: boolean;
          badge: string;
          paymentMethods: string[];
        }>
      >,
      string | void
    >({
      query: (country) => ({
        url: `/subscriptions/v1/gateways${country ? `?country=${country}` : ''}`,
        method: 'GET',
      }),
    }),
    validatePayoutAccount: builder.mutation<
      BaseResponse<{valid: boolean; accountName?: string; message?: string}>,
      {
        gateway: string;
        bankCode?: string;
        accountNumber: string;
        country?: string;
      }
    >({
      query: (body) => ({
        url: '/subscriptions/v1/validate-payout',
        method: 'POST',
        body,
      }),
    }),
    verifyPayment: builder.mutation<
      BaseResponse<any>,
      {orderTrackingId?: string; reference?: string}
    >({
      query: (body) => ({
        url: '/subscriptions/v1/verify-payment',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscription'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPlansQuery,
  useGetCurrenciesQuery,
  useGetPlanPricesQuery,
  useSetPlanPriceMutation,
  useToggleCurrencyMutation,
  useGetMySubscriptionQuery,
  usePreviewUpgradeQuery,
  useLazyPreviewUpgradeQuery,
  useSubscribeMutation,
  useCancelSubscriptionMutation,
  useGetAvailableGatewaysQuery,
  useValidatePayoutAccountMutation,
  useVerifyPaymentMutation,
} = subscriptionApi;
