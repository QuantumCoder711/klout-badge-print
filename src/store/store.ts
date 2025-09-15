import { configureStore } from '@reduxjs/toolkit';
import authReducer, { rehydrate } from './slices/authSlice';
import dashboardReducer from './slices/eventSlice';
import printerReducer from './slices/printerSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    event: dashboardReducer,
    printer: printerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Dispatch rehydrate action to load auth state from localStorage
store.dispatch(rehydrate());

export default store;
