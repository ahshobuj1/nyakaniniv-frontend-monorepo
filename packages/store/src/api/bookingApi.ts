import { baseApi } from './baseApi';
import { Booking, BaseResponse, CreateBookingRequest, UpdateBookingStatusRequest } from '../types';

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation<BaseResponse<Booking>, CreateBookingRequest>({
      query: (body) => ({
        url: '/bookings/v1/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Booking'],
    }),
    getMyBookings: builder.query<BaseResponse<Booking[]>, void>({
      query: () => ({
        url: '/bookings/v1/my-bookings',
        method: 'GET',
      }),
      providesTags: ['Booking'],
    }),
    getBookingById: builder.query<BaseResponse<Booking>, string>({
      query: (id) => ({
        url: `/bookings/v1/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Booking', id }, 'Booking'],
    }),
    updateBookingStatus: builder.mutation<BaseResponse<{ checkoutUrl?: string }>, UpdateBookingStatusRequest>({
      query: (body) => {
        const { id, ...rest } = body;
        return {
          url: `/bookings/v1/${id}/status`,
          method: 'PATCH',
          body: rest,
        };
      },
      invalidatesTags: ['Booking'],
    }),
    requestCashPayment: builder.mutation<BaseResponse<Booking>, string>({
      query: (id) => ({
        url: `/bookings/v1/${id}/request-cash`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }, 'Booking'],
    }),
    handleCashRequestDecision: builder.mutation<BaseResponse<Booking>, { id: string; decision: 'approve' | 'reject' }>({
      query: ({ id, decision }) => ({
        url: `/bookings/v1/${id}/cash-decision`,
        method: 'POST',
        body: { decision },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }, 'Booking'],
    }),
    markCashAsPaid: builder.mutation<BaseResponse<Booking>, string>({
      query: (id) => ({
        url: `/bookings/v1/${id}/mark-cash-paid`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }, 'Booking'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingByIdQuery,
  useUpdateBookingStatusMutation,
  useRequestCashPaymentMutation,
  useHandleCashRequestDecisionMutation,
  useMarkCashAsPaidMutation,
} = bookingApi;
