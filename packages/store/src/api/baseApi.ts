import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.mojacares.com/api/v1';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // Attach token from Redux state
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    // Auto logout if token is invalid/expired
    if (result?.error?.status === 401 || result?.error?.status === 403) {
      // For Redux Persist, we usually dispatch clearAuth, but localstorage removal works too
      // However, it's safer to let the store handle it, or we can just remove the item.
      if (typeof window !== 'undefined') {
        localStorage.removeItem('persist:auth'); // the key is persist:<key>
      }
    }

    return result;
  },
  tagTypes: [
    'auth', 'user', 'patient', 'service', 'booking' // Add other tags here
  ],
  endpoints: () => ({}), // Endpoints are injected in separate files
});
