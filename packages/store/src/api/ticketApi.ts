import { baseApi } from './baseApi';
import { SupportTicket, BaseResponse, CreateTicketRequest } from '../types';

export const ticketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation<BaseResponse<SupportTicket>, CreateTicketRequest>({
      query: (body) => ({
        url: '/tickets/v1/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Ticket'],
    }),
    getMyTickets: builder.query<BaseResponse<SupportTicket[]>, void>({
      query: () => ({
        url: '/tickets/v1/my-tickets',
        method: 'GET',
      }),
      providesTags: ['Ticket'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateTicketMutation,
  useGetMyTicketsQuery,
} = ticketApi;
