import { baseApi } from './baseApi';
import { BaseResponse } from '../types';

export interface TenantAnalyticsResponse {
  totalEarnings: number;
  pendingInvoices: number;
  bookings: {
    pending: number;
    accepted: number;
    completed: number;
  };
  recentRequests: any[];
}

export interface TenantChartsResponse {
  earningsChart: { month: string; amount: number }[];
  bookingsChart: { month: string; count: number }[];
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenantAnalytics: builder.query<BaseResponse<TenantAnalyticsResponse>, void>({
      query: () => ({
        url: '/analytics/v1/tenant',
        method: 'GET',
      }),
      providesTags: ['Booking', 'Tenant', 'Invoice'],
    }),
    getTenantCharts: builder.query<BaseResponse<TenantChartsResponse>, void>({
      query: () => ({
        url: '/analytics/v1/tenant/charts',
        method: 'GET',
      }),
      providesTags: ['Booking', 'Invoice'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTenantAnalyticsQuery,
  useGetTenantChartsQuery,
} = analyticsApi;
