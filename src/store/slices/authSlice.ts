import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};
// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.post<{
        status: number;
        message: string;
        name: string;
        access_token: string;
        access_token_type: string;
        company_name: string;
        user_id: number;
        user_uuid: string;
      }>(`${apiBaseUrl}/api/login`, { email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.status === 200) {
        const { access_token, user_id, ...userData } = response.data;
        localStorage.setItem('token', access_token);
        localStorage.setItem('userId', user_id.toString());
        
        return {
          ...userData,
          id: user_id,
          email,
          access_token
        } as User;
      } else {
        return rejectWithValue(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.access_token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
