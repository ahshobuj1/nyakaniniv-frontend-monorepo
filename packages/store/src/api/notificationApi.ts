import { baseApi } from './baseApi';
import { Notification, BaseResponse } from '../types';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query<BaseResponse<Notification[]>, void>({
      query: () => ({
        url: '/notifications/v1/',
        method: 'GET',
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
  }),
  overrideExisting: false,
});

export const {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
} = notificationApi;
