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
    getInvoiceById: builder.query<BaseResponse<UnifiedInvoice>, string>({
      query: (id) => ({
        url: `/invoices/v1/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Invoice', id }, 'Invoice'],
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
    downloadInvoicePdf: builder.mutation<Blob, string>({
      query: (id) => ({
        url: `/invoices/v1/${id}/pdf`,
        method: 'GET',
        responseHandler: (response: Response) => response.blob(),
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyInvoicesQuery,
  useGetInvoiceByIdQuery,
  usePayBookingMutation,
  useMarkBookingPaidMutation,
  useDownloadInvoicePdfMutation,
} = invoiceApi;
