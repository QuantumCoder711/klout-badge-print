import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Load initial state from localStorage if available
const loadInitialState = (): AuthState => {
  const savedAuth = localStorage.getItem('klout-badge-print');
  if (savedAuth) {
    try {
      const { token, user } = JSON.parse(savedAuth);
      return {
        user,
        token,
        loading: false,
        error: null,
      };
    } catch (e) {
      console.error('Failed to parse saved auth state', e);
    }
  }
  
  return {
    user: null,
    token: null,
    loading: false,
    error: null,
  };
};

const initialState: AuthState = loadInitialState();
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
        const { access_token } = response.data;
        const dataToSave = {
          token: access_token,
          user: {
            name: response.data.name,
            user_id: response.data.user_id,
            user_uuid: response.data.user_uuid,
            company_name: response.data.company_name
          }
        }

        localStorage.setItem("klout-badge-print", JSON.stringify(dataToSave));

        return {
          token: access_token,
          user: {
            name: response.data.name,
            user_id: response.data.user_id,
            user_uuid: response.data.user_uuid,
            company_name: response.data.company_name
          }
        };
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
      localStorage.removeItem('klout-badge-print');
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Add a rehydrate action to load initial state from localStorage
    rehydrate: (state) => {
      const savedAuth = localStorage.getItem('klout-badge-print');
      if (savedAuth) {
        try {
          const { token, user } = JSON.parse(savedAuth);
          state.token = token;
          state.user = user;
        } catch (e) {
          console.error('Failed to parse saved auth state', e);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: { name: string; user_id: number; user_uuid: string; company_name: string; }; }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, rehydrate } = authSlice.actions;
export default authSlice.reducer;
