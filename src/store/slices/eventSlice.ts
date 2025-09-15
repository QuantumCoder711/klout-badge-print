import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Event } from '../../types';

interface InitialState {
  events: Event[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  events: null,
  loading: false,
  error: null,
};

// Async thunk for fetching events
export const fetchEvents = createAsyncThunk(
  'dashboard/fetchEvents',
  async (_, { getState, rejectWithValue }) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_BASE_URL;
      const { auth } = getState() as { auth: { token: string | null } };
      
      if (!auth.token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await axios.post(
        `${apiBaseUrl}/api/eventslist`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    clearEvents: (state) => {
      state.events = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        
        // Check if the response has a data property (common API pattern)
        const responseData = Array.isArray(action.payload) ? action.payload : 
                           (action.payload?.data || []);
        
        // Filter for upcoming events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        state.events = responseData.filter((event: Event) => {
          if (!event?.event_start_date) return false;
          const eventDate = new Date(event.event_start_date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today;
        });
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearEvents } = eventSlice.actions;
export default eventSlice.reducer;
