import { baseApi } from './baseApi';
import { Ticket, BaseResponse, CreateTicketRequest } from '../types';

export const ticketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation<BaseResponse<Ticket>, CreateTicketRequest>({
      query: (body) => ({
        url: '/tickets/v1/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Ticket'],
    }),
    getMyTickets: builder.query<BaseResponse<Ticket[]>, void>({
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
