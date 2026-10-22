import {baseApi} from './baseApi';
import {
  Booking,
  BookingMessage,
  BookingQuote,
  BookingAgreement,
  BookingReview,
  DjScheduleData,
  BaseResponse,
  CreateBookingRequest,
  InitiateBookingResponse,
  VerifyBookingOtpRequest,
  ResendBookingOtpRequest,
  UpdateBookingStatusRequest,
  RequestBookingAccessOtpRequest,
  VerifyBookingAccessOtpRequest,
  ResendBookingAccessOtpRequest,
  BookingAccessResponse,
  SendBookingMessageRequest,
  ProposeQuoteRequest,
  AcceptQuoteRequest,
  RejectQuoteRequest,
  ReportDirectPaymentRequest,
  ReportIssueRequest,
  SubmitReviewRequest,
} from '../types';

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Guest Booking Creation Flow
    initiateBooking: builder.mutation<
      BaseResponse<InitiateBookingResponse>,
      CreateBookingRequest
    >({
      query: (body) => ({
        url: '/bookings/v1/initiate',
        method: 'POST',
        body,
      }),
    }),
    verifyBookingOtp: builder.mutation<
      BaseResponse<Booking>,
      VerifyBookingOtpRequest
    >({
      query: (body) => ({
        url: '/bookings/v1/verify-otp',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Booking'],
    }),
    resendBookingOtp: builder.mutation<
      BaseResponse<InitiateBookingResponse>,
      ResendBookingOtpRequest
    >({
      query: (body) => ({
        url: '/bookings/v1/resend-otp',
        method: 'POST',
        body,
      }),
    }),
    createBooking: builder.mutation<
      BaseResponse<Booking>,
      CreateBookingRequest
    >({
      query: (body) => ({
        url: '/bookings/v1/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Booking'],
    }),

    // Secure Booking Portal Access (Order Ref + Email OTP)
    requestBookingAccessOtp: builder.mutation<
      BaseResponse<{sessionToken: string; message: string}>,
      RequestBookingAccessOtpRequest
    >({
      query: (body) => ({
        url: '/bookings/v1/access/request-otp',
        method: 'POST',
        body,
      }),
    }),
    verifyBookingAccessOtp: builder.mutation<
      BaseResponse<BookingAccessResponse>,
      VerifyBookingAccessOtpRequest
    >({
      query: (body) => ({
        url: '/bookings/v1/access/verify-otp',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Booking'],
    }),
    resendBookingAccessOtp: builder.mutation<
      BaseResponse<{sessionToken: string; message: string}>,
      ResendBookingAccessOtpRequest
    >({
      query: (body) => ({
        url: '/bookings/v1/access/resend-otp',
        method: 'POST',
        body,
      }),
    }),

    // Portal Details
    getBookingPortalDetails: builder.query<BaseResponse<Booking>, string>({
      query: (id) => ({
        url: `/bookings/v1/${id}/portal`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{type: 'Booking', id}, 'Booking'],
    }),

    // DJ Bookings Query
    getMyBookings: builder.query<
      BaseResponse<Booking[]> & {meta?: any},
      Record<string, any> | void
    >({
      query: (params) => ({
        url: '/bookings/v1/my-bookings',
        method: 'GET',
        params: params ? {...params} : undefined,
      }),
      providesTags: ['Booking'],
    }),

    getBookingById: builder.query<BaseResponse<Booking>, string>({
      query: (id) => ({
        url: `/bookings/v1/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{type: 'Booking', id}, 'Booking'],
    }),

    updateBookingStatus: builder.mutation<
      BaseResponse<Booking>,
      UpdateBookingStatusRequest
    >({
      query: (body) => {
        const {id, ...rest} = body;
        return {
          url: `/bookings/v1/${id}/status`,
          method: 'PATCH',
          body: rest,
        };
      },
      invalidatesTags: (result, error, {id}) => [
        {type: 'Booking', id},
        'Booking',
      ],
    }),

    // Asynchronous Messages
    getBookingMessages: builder.query<BaseResponse<BookingMessage[]>, string>({
      query: (id) => ({
        url: `/bookings/v1/${id}/messages`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [
        {type: 'Booking', id: `messages-${id}`},
      ],
    }),
    sendBookingMessage: builder.mutation<
      BaseResponse<BookingMessage>,
      SendBookingMessageRequest
    >({
      query: (body) => {
        const id = body.id || body.bookingId;
        return {
          url: `/bookings/v1/${id}/messages`,
          method: 'POST',
          body: {content: body.content},
        };
      },
      invalidatesTags: (result, error, arg) => {
        const id = arg.id || arg.bookingId;
        return [
          {type: 'Booking', id: `messages-${id}`},
          {type: 'Booking', id},
        ];
      },
    }),

    // Quote Negotiation
    proposeQuote: builder.mutation<BaseResponse<BookingQuote>, ProposeQuoteRequest>({
      query: (body) => {
        const id = body.id || body.bookingId;
        return {
          url: `/bookings/v1/${id}/quotes`,
          method: 'POST',
          body: {
            amount: body.amount,
            currency: body.currency,
            notes: body.notes || body.message,
          },
        };
      },
      invalidatesTags: (result, error, arg) => {
        const id = arg.id || arg.bookingId;
        return [
          {type: 'Booking', id},
          'Booking',
        ];
      },
    }),
    acceptQuote: builder.mutation<BaseResponse<BookingAgreement>, AcceptQuoteRequest>({
      query: (body) => {
        const id = body.id || body.bookingId;
        return {
          url: `/bookings/v1/${id}/quotes/${body.quoteId}/accept`,
          method: 'POST',
        };
      },
      invalidatesTags: (result, error, arg) => {
        const id = arg.id || arg.bookingId;
        return [
          {type: 'Booking', id},
          'Booking',
        ];
      },
    }),
    rejectQuote: builder.mutation<
      BaseResponse<{success: boolean; message: string}>,
      RejectQuoteRequest
    >({
      query: (body) => {
        const id = body.id || body.bookingId;
        return {
          url: `/bookings/v1/${id}/quotes/${body.quoteId}/reject`,
          method: 'POST',
          body: {reason: body.reason},
        };
      },
      invalidatesTags: (result, error, arg) => {
        const id = arg.id || arg.bookingId;
        return [
          {type: 'Booking', id},
          'Booking',
        ];
      },
    }),

    // Direct Payment Reporting (Informational)
    reportDirectPayment: builder.mutation<
      BaseResponse<Booking>,
      ReportDirectPaymentRequest
    >({
      query: ({id, ...body}) => ({
        url: `/bookings/v1/${id}/report-payment`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, {id}) => [
        {type: 'Booking', id},
        'Booking',
      ],
    }),
    confirmDirectPayment: builder.mutation<
      BaseResponse<Booking>,
      string | {id: string}
    >({
      query: (arg) => {
        const id = typeof arg === 'string' ? arg : arg.id;
        return {
          url: `/bookings/v1/${id}/confirm-payment`,
          method: 'POST',
        };
      },
      invalidatesTags: (result, error, arg) => {
        const id = typeof arg === 'string' ? arg : arg.id;
        return [
          {type: 'Booking', id},
          'Booking',
        ];
      },
    }),

    // Completion, Issue & Review
    requestCompletion: builder.mutation<
      BaseResponse<{success: boolean; message: string}>,
      string
    >({
      query: (id) => ({
        url: `/bookings/v1/${id}/request-completion`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        {type: 'Booking', id},
        'Booking',
      ],
    }),
    confirmCompletion: builder.mutation<BaseResponse<Booking>, string>({
      query: (id) => ({
        url: `/bookings/v1/${id}/confirm-completion`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        {type: 'Booking', id},
        'Booking',
      ],
    }),
    reportIssue: builder.mutation<BaseResponse<Booking>, ReportIssueRequest>({
      query: (body) => ({
        url: `/bookings/v1/${body.id}/report-issue`,
        method: 'POST',
        body: {description: body.description || body.issueDescription},
      }),
      invalidatesTags: (result, error, {id}) => [
        {type: 'Booking', id},
        'Booking',
      ],
    }),
    submitReview: builder.mutation<BaseResponse<BookingReview>, SubmitReviewRequest>({
      query: (body) => {
        const id = body.id || body.bookingId;
        return {
          url: `/bookings/v1/${id}/review`,
          method: 'POST',
          body: {
            rating: body.rating,
            reviewText: body.reviewText || body.comment,
          },
        };
      },
      invalidatesTags: (result, error, arg) => {
        const id = arg.id || arg.bookingId;
        return [
          {type: 'Booking', id},
          'Booking',
        ];
      },
    }),

    // DJ Schedule
    getDjSchedule: builder.query<
      BaseResponse<DjScheduleData>,
      {view?: 'today' | 'tomorrow' | 'upcoming' | 'past' | 'needs_action'} | void
    >({
      query: (params) => ({
        url: '/bookings/v1/schedule',
        method: 'GET',
        params: params ? {...params} : undefined,
      }),
      providesTags: ['Booking'],
    }),

    // Compatibility endpoints
    getClientBooking: builder.query<BaseResponse<Booking>, string>({
      query: (id) => ({
        url: `/bookings/v1/client/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{type: 'Booking', id}, 'Booking'],
    }),
    clientCancelBooking: builder.mutation<
      BaseResponse<{success: boolean; message: string}>,
      {id: string; reason?: string}
    >({
      query: ({id, reason}) => ({
        url: `/bookings/v1/client/${id}/cancel`,
        method: 'POST',
        body: {reason},
      }),
      invalidatesTags: (result, error, {id}) => [
        {type: 'Booking', id},
        'Booking',
      ],
    }),
    handleCashRequestDecision: builder.mutation<
      BaseResponse<Booking>,
      {id: string; decision: 'approve' | 'reject'}
    >({
      query: ({id}) => ({
        url: `/bookings/v1/${id}/confirm-payment`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, {id}) => [
        {type: 'Booking', id},
        'Booking',
      ],
    }),
    markCashAsPaid: builder.mutation<BaseResponse<Booking>, string>({
      query: (id) => ({
        url: `/bookings/v1/${id}/confirm-payment`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        {type: 'Booking', id},
        'Booking',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useInitiateBookingMutation,
  useVerifyBookingOtpMutation,
  useResendBookingOtpMutation,
  useCreateBookingMutation,
  useRequestBookingAccessOtpMutation,
  useVerifyBookingAccessOtpMutation,
  useResendBookingAccessOtpMutation,
  useGetBookingPortalDetailsQuery,
  useGetMyBookingsQuery,
  useGetBookingByIdQuery,
  useUpdateBookingStatusMutation,
  useGetBookingMessagesQuery,
  useSendBookingMessageMutation,
  useProposeQuoteMutation,
  useAcceptQuoteMutation,
  useRejectQuoteMutation,
  useReportDirectPaymentMutation,
  useConfirmDirectPaymentMutation,
  useRequestCompletionMutation,
  useConfirmCompletionMutation,
  useReportIssueMutation,
  useSubmitReviewMutation,
  useGetDjScheduleQuery,
  useGetClientBookingQuery,
  useClientCancelBookingMutation,
  useHandleCashRequestDecisionMutation,
  useMarkCashAsPaidMutation,
} = bookingApi;
