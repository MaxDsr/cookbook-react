import { createSlice } from "@reduxjs/toolkit";

export const errorAlertSlice = createSlice({
  name: 'errorAlert',
  initialState: {
    value: '',
  },
  reducers: {
    setErrorAlert: (state, action) => {
      state.value = action.payload;
    },
  }
});

export const { setErrorAlert } = errorAlertSlice.actions;
