import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
  // Additional Auth0 properties that might be useful
  token: null,
  idTokenClaims: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      const { 
        isAuthenticated, 
        isLoading, 
        user, 
        error,
        token,
        idTokenClaims 
      } = action.payload;
      
      state.isAuthenticated = isAuthenticated;
      state.isLoading = isLoading;
      state.user = user;
      state.error = error;
      state.token = token;
      state.idTokenClaims = idTokenClaims;
    },
    clearAuthData: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = null;
      state.error = null;
      state.token = null;
      state.idTokenClaims = null;
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
