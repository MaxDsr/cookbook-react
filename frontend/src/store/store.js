import { configureStore } from '@reduxjs/toolkit';
import { recipesApi } from './api/recipesApi';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [recipesApi.reducerPath]: recipesApi.reducer,
    auth: authReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for RTK Query
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
        ],
      },
    }).concat(recipesApi.middleware),
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Optional: export types for TypeScript (if you decide to migrate later)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
