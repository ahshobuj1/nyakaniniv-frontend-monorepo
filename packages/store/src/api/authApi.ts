import { baseApi } from './baseApi';
import {
  RegisterRequest,
  LoginRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
  BaseResponse,
} from '../types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<BaseResponse<null>, RegisterRequest>({
      query: (body) => ({
        url: '/auth/v1/register',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<BaseResponse<AuthResponse>, LoginRequest>({
      query: (body) => ({
        url: '/auth/v1/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    verifyOtp: builder.mutation<BaseResponse<AuthResponse>, VerifyOtpRequest>({
      query: (body) => ({
        url: '/auth/v1/verify',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    resendOtp: builder.mutation<BaseResponse<null>, ResendOtpRequest>({
      query: (body) => ({
        url: '/auth/v1/resend-otp',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<BaseResponse<null>, void>({
      query: () => ({
        url: '/auth/v1/logout',
        method: 'POST',
      }),
      // Clear global cache related to user data if needed
      invalidatesTags: ['Auth', 'User', 'Tenant'],
    }),
    forgotPassword: builder.mutation<BaseResponse<null>, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/auth/v1/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<BaseResponse<null>, ResetPasswordRequest>({
      query: (body) => ({
        url: '/auth/v1/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
