import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import {
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi,
  TNewOrderResponse
} from '@api';

export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(orderData);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getByNumber',
  async (orderNumber: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(orderNumber);
      return response.orders[0] || null;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export interface IOrdersState {
  ordersList: {
    isLoading: boolean;
    orders: TOrder[];
    error: string | null;
  };
  createdOrder: {
    order: TNewOrderResponse | null;
    orderData: TOrder | null;
    isLoading: boolean;
    error: string | null;
  };
  receivedOrder: {
    data: TOrder | null;
    isLoading: boolean;
    error: string | null;
  };
}

export const initialState: IOrdersState = {
  ordersList: {
    isLoading: false,
    orders: [],
    error: null
  },
  createdOrder: {
    order: null,
    orderData: null,
    isLoading: false,
    error: null
  },
  receivedOrder: {
    data: null,
    isLoading: false,
    error: null
  }
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  selectors: {
    ordersItems: (state) => state.ordersList.orders,
    ordersIsLoading: (state) => state.ordersList.isLoading,
    ordersError: (state) => state.ordersList.error,

    orderPending: (state) => state.createdOrder.isLoading,
    orderReject: (state) => state.createdOrder.error,
    orderResponse: (state) => state.createdOrder.order,
    orderContent: (state) => state.createdOrder.orderData,

    orderItemData: (state) => state.receivedOrder.data,
    orderGetting: (state) => state.receivedOrder.isLoading,
    orderGettingError: (state) => state.receivedOrder.error
  },
  reducers: {
    clearOrderModalData: (state) => {
      state.createdOrder.order = null;
      state.createdOrder.orderData = null;
      state.createdOrder.isLoading = false;
      state.createdOrder.error = null;
    },
    clearOrdersError: (state) => {
      state.ordersList.error = null;
      state.createdOrder.error = null;
      state.receivedOrder.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.ordersList.isLoading = true;
        state.ordersList.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.ordersList.isLoading = false;
        state.ordersList.error =
          action.error.message || 'Ошибка загрузки заказов';
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.ordersList.isLoading = false;
        state.ordersList.orders = action.payload;
      });

    builder
      .addCase(createOrder.pending, (state) => {
        state.createdOrder.isLoading = true;
        state.createdOrder.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createdOrder.isLoading = false;
        state.createdOrder.error =
          action.error.message || 'Ошибка создания заказа';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createdOrder.isLoading = false;
        state.createdOrder.order = action.payload;
        state.createdOrder.orderData = action.payload.order;
      });

    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.receivedOrder.isLoading = true;
        state.receivedOrder.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.receivedOrder.isLoading = false;
        state.receivedOrder.error =
          action.error.message || 'Ошибка загрузки заказа';
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.receivedOrder.isLoading = false;
        state.receivedOrder.data = action.payload;
      });
  }
});

export const {
  ordersItems,
  ordersIsLoading,
  ordersError,
  orderPending,
  orderReject,
  orderResponse,
  orderContent,
  orderItemData,
  orderGetting,
  orderGettingError
} = ordersSlice.selectors;

export const { clearOrderModalData, clearOrdersError } = ordersSlice.actions;
