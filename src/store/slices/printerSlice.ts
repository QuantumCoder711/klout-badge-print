import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { domain } from '@/constants';
import { RootState } from '../store';

interface PrinterState {
  printerCount: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: PrinterState = {
  printerCount: null,
  loading: false,
  error: null,
};

interface PrinterResponse {
  data: {
    printer_count: number;
  };
}

// Async thunk for fetching printer count
export const fetchPrinterCount = createAsyncThunk<
  number,
  string,
  { state: RootState }
>(
  'printer/fetchCount',
  async (eventUuid: string, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await axios.post<PrinterResponse>(
        `${domain}/api/display/${eventUuid}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      return response.data.data.printer_count;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch printer count');
    }
  }
);

const printerSlice = createSlice({
  name: 'printer',
  initialState,
  reducers: {
    resetPrinterState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrinterCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrinterCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.printerCount = action.payload;
        state.error = null;
      })
      .addCase(fetchPrinterCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch printer count';
      });
  },
});

export const { resetPrinterState } = printerSlice.actions;
export default printerSlice.reducer;
