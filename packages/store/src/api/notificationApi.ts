import { baseApi } from './baseApi';
import { Notification, BaseResponse, PaginatedResponse } from '../types';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query<PaginatedResponse<Notification>, Record<string, unknown> | void>({
      query: (params) => ({
        url: '/notifications/v1/my-notifications',
        method: 'GET',
        params: params || {},
      }),
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation<BaseResponse<Notification>, string>({
      query: (id) => ({
        url: `/notifications/v1/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    getUnreadCount: builder.query<BaseResponse<{ count: number }>, void>({
      query: () => ({
        url: '/notifications/v1/unread-count',
        method: 'GET',
      }),
      providesTags: ['Notification'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
  useGetUnreadCountQuery,
} = notificationApi;
