import { baseApi } from './baseApi';
import { BaseResponse, BookingPayment, SubscriptionInvoice, PaginatedResponse } from '../types';

export type UnifiedInvoice = (BookingPayment | SubscriptionInvoice) & {
  type: 'BOOKING' | 'SUBSCRIPTION';
};

export const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyInvoices: builder.query<PaginatedResponse<UnifiedInvoice>, void>({
      query: () => ({
        url: '/invoices/v1/my-invoices',
        method: 'GET',
      }),
      providesTags: ['Invoice'],
    }),
    payBooking: builder.mutation<BaseResponse<{ checkoutUrl: string }>, string>({
      query: (id) => ({
        url: `/invoices/v1/${id}/pay`,
        method: 'POST',
      }),
    }),
    markBookingPaid: builder.mutation<BaseResponse<any>, string>({
      query: (id) => ({
        url: `/invoices/v1/${id}/mark-paid`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Invoice', 'Booking'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyInvoicesQuery,
  usePayBookingMutation,
  useMarkBookingPaidMutation,
} = invoiceApi;
