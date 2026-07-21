# Redux Store Architecture

This document outlines the Redux architecture and folder structure used in the project. The project utilizes **Redux Toolkit (RTK)** along with **RTK Query** for state management and data fetching, and **Redux Persist** for local storage persistence.

## Directory Structure

```text
src/redux/
├── store.ts               # Main Redux store configuration
├── hooks.ts               # Typed hooks (useAppDispatch, useAppSelector)
├── api/                   # RTK Query API slices (Data Fetching & Server State)
│   ├── baseApi.ts         # The base API configuration (baseUrl, auth headers, error handling)
│   ├── booking.api.ts     # Domain-specific API slices injected into baseApi
│   ├── patient.api.ts     
│   ├── chat.api.ts        
│   └── ...                # Other domain API slices (care, staff, visit, etc.)
└── features/              # Standard Redux slices (Client State)
    └── auth/              
        ├── authSlice.ts   # Reducer for auth state (tokens, user info)
        ├── auth.api.ts    # Extended API slice for authentication endpoints
        └── patientSlice.ts # Reducer for patient-specific state
```

## Core Components

### 1. Store Configuration (`store.ts`)
- The central store integrates standard reducers (like `auth`, `patient`) and the `baseApi` reducer from RTK Query.
- Uses `redux-persist` to persist slices (e.g., `auth`) to the browser's `localStorage`, allowing sessions to survive page reloads.
- Configures middleware to include both the default middleware (with serializable checks disabled for Redux Persist actions) and RTK Query's caching middleware.

### 2. Typed Hooks (`hooks.ts`)
- Provides pre-typed versions of `useDispatch` and `useSelector` as `useAppDispatch` and `useAppSelector` for type-safe state access across components. You should always use these instead of the default ones from `react-redux`.

### 3. RTK Query / API (`api/` folder)
- **`baseApi.ts`**: The foundation for all network requests. It configures `fetchBaseQuery` with the `BASE_URL` and automatically attaches the `Bearer token` from the Redux `auth` state to authorization headers. It also includes global error handling (e.g., auto-logout on 401/403 errors) and defines all `tagTypes` for cache invalidation.
- **Domain API Slices (e.g., `patient.api.ts`, `booking.api.ts`)**: Instead of creating multiple APIs, the application uses **code splitting** via `baseApi.injectEndpoints()`. This divides API endpoints into separate files based on their domain while maintaining a single API cache.

### 4. Features / Client State (`features/` folder)
- Contains standard Redux slices created with `createSlice`.
- Used for storing global client-side state that isn't handled by RTK Query (like auth tokens, active patient details).

## Code Examples

### 1. Store Configuration (`store.ts`)
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
import authReducer from './features/auth/authSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'auth',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore redux-persist actions
      },
    }).concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
```

### 2. Base API Setup (`api/baseApi.ts`)
This is the root API slice. It defines the base URL, sets up headers (including tokens), and manages global error states.
```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

const BASE_URL = 'https://api.mojacares.com';

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api/v1`,
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
      localStorage.removeItem('auth');
    }

    return result;
  },
  tagTypes: [
    'auth', 'user', 'patient', 'service', 'booking' // Add other tags here
  ],
  endpoints: () => ({}), // Endpoints are injected in separate files
});
```

### 3. Injecting Domain Endpoints (`api/patient.api.ts`)
Instead of putting all endpoints in `baseApi.ts`, we split them using `injectEndpoints`.
```typescript
import { baseApi } from './baseApi';

const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSinglePatientProfiles: builder.query({
      query: (id) => ({
        url: `/patients/${id}`,
        method: 'GET'
      }),
      providesTags: ['patient'],
    }),

    addPatientProfile: builder.mutation({
      query: (formData) => ({
        url: `/patients/profile`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['patient', 'user'],
    }),
  }),
});

// Auto-generated hooks based on endpoint names
export const {
  useGetSinglePatientProfilesQuery,
  useAddPatientProfileMutation,
} = patientApi;
```

### 4. Client State Slice (`features/auth/authSlice.ts`)
Standard Redux slice for local state.
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: any | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;
```

### 5. Custom Typed Hooks (`hooks.ts`)
```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```
