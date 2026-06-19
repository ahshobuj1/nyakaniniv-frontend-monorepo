import { baseApi } from './baseApi';
import { Invoice, BaseResponse } from '../types';

export const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyInvoices: builder.query<BaseResponse<Invoice[]>, void>({
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
    markBookingPaid: builder.mutation<BaseResponse<Invoice>, string>({
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
