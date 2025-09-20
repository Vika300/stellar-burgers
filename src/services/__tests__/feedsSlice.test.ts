import { initialState, getFeeds, feedsSlice } from '../slices/feedsSlice';
import { mockOrder } from '../__tests__/ordersSlice.test'

const mockFeedsResponse = {
  success: true,
  orders: [mockOrder],
  total: 999,
  totalToday: 1
};

describe('[feedsSlice] test', () => {
  test('getFeeds.pending', () => {
    const state = feedsSlice.reducer(initialState, getFeeds.pending('', undefined));

    expect(state.isLoading).toBeTruthy();
  });

  test('getFeeds.fulfilled', () => {
    const state = feedsSlice.reducer(
      initialState,
      getFeeds.fulfilled(mockFeedsResponse, '', undefined)
    );

    expect(state.isLoading).toBeFalsy();
    expect(state.orders).toEqual(mockFeedsResponse.orders);
    expect(state.total).toBe(mockFeedsResponse.total);
    expect(state.totalToday).toBe(mockFeedsResponse.totalToday);
  });

  test('getFeeds.rejected', () => {
    const state = feedsSlice.reducer(
      initialState,
      getFeeds.rejected(null, '', undefined)
    );

    expect(state.isLoading).toBeFalsy();
    expect(state.error).toBe('Ошибка загрузки');
  });
});