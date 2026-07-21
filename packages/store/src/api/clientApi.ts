import { baseApi } from './baseApi';
import { Client, BaseResponse } from '../types';

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyClients: builder.query<BaseResponse<Client[]>, void>({
      query: () => ({
        url: '/clients/v1/',
        method: 'GET',
      }),
      providesTags: ['Client'],
    }),
    getClientDetails: builder.query<BaseResponse<Client>, string>({
      query: (id) => ({
        url: `/clients/v1/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Client', id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyClientsQuery,
  useGetClientDetailsQuery,
} = clientApi;
