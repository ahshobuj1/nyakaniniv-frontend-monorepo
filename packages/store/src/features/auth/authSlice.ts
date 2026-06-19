import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import { User } from '../../types';

export interface AuthState {
  token: string | null;
  user: User | null;
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
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        // Handle BaseResponse wrapper if present
        const data = 'data' in payload ? (payload as any).data : payload;
        if (data?.token) {
          state.token = data.token;
          if (data.user) {
            state.user = data.user;
          }
        }
      }
    );
    builder.addMatcher(
      authApi.endpoints.verifyOtp.matchFulfilled,
      (state, { payload }) => {
        const data = 'data' in payload ? (payload as any).data : payload;
        if (data?.token) {
          state.token = data.token;
          if (data.user) {
            state.user = data.user;
          }
        }
      }
    );
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;
