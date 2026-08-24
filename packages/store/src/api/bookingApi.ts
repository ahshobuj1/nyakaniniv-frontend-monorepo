import { baseApi } from './baseApi';
import {
  Booking,
  BaseResponse,
  CreateBookingRequest,
  InitiateBookingResponse,
  VerifyBookingOtpRequest,
  ResendBookingOtpRequest,
  UpdateBookingStatusRequest,
} from '../types';

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initiateBooking: builder.mutation<BaseResponse<InitiateBookingResponse>, CreateBookingRequest>({
      query: (body) => ({
        url: '/bookings/v1/initiate',
        method: 'POST',
        body,
      }),
    }),
    verifyBookingOtp: builder.mutation<BaseResponse<Booking>, VerifyBookingOtpRequest>({
      query: (body) => ({
        url: '/bookings/v1/verify-otp',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Booking'],
    }),
    resendBookingOtp: builder.mutation<BaseResponse<InitiateBookingResponse>, ResendBookingOtpRequest>({
      query: (body) => ({
        url: '/bookings/v1/resend-otp',
        method: 'POST',
        body,
      }),
    }),
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
  useInitiateBookingMutation,
  useVerifyBookingOtpMutation,
  useResendBookingOtpMutation,
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingByIdQuery,
  useUpdateBookingStatusMutation,
  useRequestCashPaymentMutation,
  useHandleCashRequestDecisionMutation,
  useMarkCashAsPaidMutation,
} = bookingApi;
