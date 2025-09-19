import {
  getOrders,
  createOrder,
  getOrderByNumber,
  initialState,
  ordersSlice
} from '../slices/ordersSlice';

import { TOrder } from '@utils-types';

export const mockOrder: TOrder = {
  _id: '68cc433c673086001ba88c17',
  createdAt: '2025-09-18T17:37:00.495Z',
  ingredients: [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa0949',
    '643d69a5c3f7b9001cfa0940',
    '643d69a5c3f7b9001cfa0942',
    '643d69a5c3f7b9001cfa0946',
    '643d69a5c3f7b9001cfa093c'
  ],
  status: 'done',
  name: 'Краторный минеральный экзо-плантаго spicy люминесцентный метеоритный бургер',
  number: 89003,
  updatedAt: '2025-09-18T17:37:01.744Z'
};

const newOrder: string[] = [
  '643d69a5c3f7b9001cfa093c',
  '643d69a5c3f7b9001cfa093e',
  '643d69a5c3f7b9001cfa0949',
  '643d69a5c3f7b9001cfa0940',
  '643d69a5c3f7b9001cfa0942'
];

const mockNewOrderResponse = {
  success: true,
  order: mockOrder,
  name: mockOrder.name
};


describe('[ordersSlice] test', () => {
  describe('[getOrders]: получение заказов пользователя', () => {
    test('getOrders.pending', () => {
      const state = ordersSlice.reducer(
        initialState,
        getOrders.pending('', undefined)
      );

      expect(state.ordersList.isLoading).toBeTruthy();
    });

    test('getOrders.fulfilled', () => {
      const state = ordersSlice.reducer(
        initialState,
        getOrders.fulfilled([mockOrder], '', undefined)
      );

      expect(state.ordersList.isLoading).toBeFalsy();
      expect(state.ordersList.orders).toEqual([mockOrder]);
    });

    test('getOrders.rejected', () => {
      const state = ordersSlice.reducer(
        initialState,
        getOrders.rejected(null, '', undefined)
      );

      expect(state.ordersList.isLoading).toBeFalsy();
      expect(state.ordersList.error).toBe('Ошибка загрузки заказов');
    });
  });

  describe('[createOrder]: создание заказа', () => {
    test('createOrder.pending', () => {
      const state = ordersSlice.reducer(
        initialState,
        createOrder.pending('', newOrder)
      );

      expect(state.createdOrder.isLoading).toBeTruthy();
    });

    test('createOrder.fulfilled', () => {
      const state = ordersSlice.reducer(
        initialState,
        createOrder.fulfilled(mockNewOrderResponse, '', newOrder)
      );

      expect(state.createdOrder.isLoading).toBeFalsy();
      expect(state.createdOrder.orderData).toEqual(mockOrder);
    });

    test('createOrder.rejected', () => {
      const state = ordersSlice.reducer(
        initialState,
        createOrder.rejected(null, '', newOrder)
      );

      expect(state.createdOrder.isLoading).toBeFalsy();
      expect(state.createdOrder.error).toBe('Ошибка создания заказа');
    });
  });

  describe('[getOrderByNumber]: получение заказа по номеру', () => {
    test('getOrderByNumber.pending', () => {
      const state = ordersSlice.reducer(
        initialState,
        getOrderByNumber.pending('', mockOrder.number)
      );

      expect(state.receivedOrder.isLoading).toBeTruthy();
    });

    test('getOrderByNumber.fulfilled', () => {
      const state = ordersSlice.reducer(
        initialState,
        getOrderByNumber.fulfilled(mockOrder, '', mockOrder.number)
      );

      expect(state.receivedOrder.isLoading).toBeFalsy();
      expect(state.receivedOrder.data).toEqual(mockOrder);
    });

    test('getOrderByNumber.rejected', () => {
      const state = ordersSlice.reducer(
        initialState,
        getOrderByNumber.rejected(null, '', mockOrder.number)
      );

      expect(state.receivedOrder.isLoading).toBeFalsy();
      expect(state.receivedOrder.error).toBe('Ошибка загрузки заказа');
    });
  });
});