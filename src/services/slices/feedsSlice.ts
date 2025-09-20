import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { getFeedsApi } from '../../utils/burger-api';

export const getFeeds = createAsyncThunk(
  'feeds/getFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export interface IFeedsState {
  isLoading: boolean;
  error: string | null;
  orders: TOrder[];
  total: number;
  totalToday: number;
}

export const initialState: IFeedsState = {
  isLoading: false,
  error: null,
  orders: [],
  total: 0,
  totalToday: 0
};

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  selectors: {
    feedsIsLoading: (state) => state.isLoading,
    feedsError: (state) => state.error,
    feedsItems: (state) => state.orders,
    feedsTotal: (state) => state.total,
    feedsTotalToday: (state) => state.totalToday
  },
  reducers: {
    clearFeedsError: (state) => {
      state.error = null;
    },
    resetFeeds: (state) => {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
      state.error = null;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'Ошибка загрузки';
      });
  }
});

export const {
  feedsIsLoading,
  feedsError,
  feedsItems,
  feedsTotal,
  feedsTotalToday
} = feedsSlice.selectors;

export const { clearFeedsError, resetFeeds } = feedsSlice.actions;
