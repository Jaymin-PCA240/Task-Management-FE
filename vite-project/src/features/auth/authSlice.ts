import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

// Define Auth State Type
interface AuthState {
  user: any | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
};

// Register User
export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data: any, thunkAPI) => {
    try {
      const res = await api.post('/auth/register', data);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// Login User
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (data: any, thunkAPI) => {
    try {
      const res = await api.post('/auth/login', data);
      debugger;
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// Refresh Token
export const refreshTokenThunk = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    try {
      const res = await api.post('/auth/refresh');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Token refresh failed');
    }
  }
);

// Logout User
export const logoutThunk = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await api.post('/auth/logout');
    return true;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Logout failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        debugger;
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        debugger;
        state.loading = false;
        state.user = payload.data.user;
        state.accessToken = payload.data.token;
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        debugger;
        state.loading = false;
        state.error = payload as string;
      });

    // Register
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.accessToken = payload.token;
      })
      .addCase(registerThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });

    // Refresh Token
    builder
      .addCase(refreshTokenThunk.fulfilled, (state, { payload }) => {
        state.accessToken = payload.token;
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.accessToken = null;
        state.user = null;
      });

    // Logout
    builder
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
