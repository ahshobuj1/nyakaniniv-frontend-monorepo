import { baseApi } from './baseApi';
import { Event, BaseResponse, CreateEventRequest, UpdateEventRequest } from '../types';

export const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenantEvents: builder.query<BaseResponse<Event[]>, string>({
      query: (tenantId) => ({
        url: `/events/v1/tenant/${tenantId}`,
        method: 'GET',
      }),
      providesTags: ['Event'],
    }),
    getEventById: builder.query<BaseResponse<Event>, string>({
      query: (id) => ({
        url: `/events/v1/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Event', id }],
    }),
    createEvent: builder.mutation<BaseResponse<Event>, CreateEventRequest>({
      query: (body) => {
        let requestBody: any = body;
        if (body.coverImage && typeof body.coverImage !== 'string') {
          const formData = new FormData();
          Object.keys(body).forEach((key) => {
            const value = (body as any)[key];
            if (value !== undefined) {
              formData.append(key, value);
            }
          });
          requestBody = formData;
        }

        return {
          url: '/events/v1/',
          method: 'POST',
          body: requestBody,
        };
      },
      invalidatesTags: ['Event'],
    }),
    updateEvent: builder.mutation<BaseResponse<Event>, UpdateEventRequest>({
      query: (body) => {
        const { id, ...rest } = body;
        let requestBody: any = rest;

        if (body.coverImage && typeof body.coverImage !== 'string') {
          const formData = new FormData();
          Object.keys(rest).forEach((key) => {
            const value = (rest as any)[key];
            if (value !== undefined) {
              formData.append(key, value);
            }
          });
          requestBody = formData;
        }

        return {
          url: `/events/v1/${id}`,
          method: 'PATCH',
          body: requestBody,
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Event', id: arg.id }, 'Event'],
    }),
    deleteEvent: builder.mutation<BaseResponse<null>, string>({
      query: (id) => ({
        url: `/events/v1/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTenantEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;
