import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api, withAuth } from '../api/client';
import type { User } from '../types';
import type { RootState } from './index';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
  emailForOtp: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: 'idle',
  error: null,
  emailForOtp: null,
};

export const requestOtp = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('auth/requestOtp', async (email, { rejectWithValue, dispatch }) => {
  try {
    await api.post('/auth/request-otp', { email });
    dispatch(setEmailForOtp(email));
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? 'Failed to request OTP');
  }
});

export const verifyOtp = createAsyncThunk<
  { accessToken: string; user: User },
  { email: string; code: string },
  { rejectValue: string }
>('auth/verifyOtp', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/verify-otp', payload);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? 'Failed to verify OTP');
  }
});

export const fetchMe = createAsyncThunk<
  { userId: string; email: string },
  void,
  { state: RootState; rejectValue: string }
>('auth/me', async (_arg, { getState, rejectWithValue }) => {
  const token = getState().auth.accessToken;
  if (!token) return rejectWithValue('No token');
  try {
    const res = await withAuth(token).get('/auth/me');
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? 'Failed to fetch user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmailForOtp(state, action: PayloadAction<string | null>) {
      state.emailForOtp = action.payload;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.emailForOtp = null;
      state.status = 'idle';
      state.error = null;
    },
    hydrateFromStorage(state) {
      const raw = localStorage.getItem('auth');
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as Pick<AuthState, 'accessToken' | 'user'>;
        state.accessToken = parsed.accessToken ?? null;
        state.user = parsed.user ?? null;
      } catch {
        // ignore
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Error';
      })
      .addCase(verifyOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem(
          'auth',
          JSON.stringify({ user: state.user, accessToken: state.accessToken }),
        );
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Error';
      });
  },
});

export const { logout, hydrateFromStorage, setEmailForOtp } = authSlice.actions;
export default authSlice.reducer;
