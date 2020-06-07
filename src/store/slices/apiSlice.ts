import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ApiCallStatus } from '../../types';

export type ApiState = {
  status: ApiCallStatus;
  url: string;
  errorMessage?: string;
};

const initialState: ApiState = {
  status: 'idle',
  url: '',
};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    getUrlRequested(state) {
      state.status = 'loading';
    },
    getUrlSucceeded(state, action: PayloadAction<{ url: string }>) {
      const { url } = action.payload;

      state.status = 'success';
      state.url = url;
    },
    getUrlFailed(state, action: PayloadAction<{ errorMessage: string }>) {
      const { errorMessage } = action.payload;

      state.status = 'error';
      state.errorMessage = errorMessage;
    },
  },
});

export const apiReducer = apiSlice.reducer;
export const apiActions = apiSlice.actions;
