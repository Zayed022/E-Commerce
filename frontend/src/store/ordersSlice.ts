import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { withAuth } from '../api/client';
import type { RootState } from './index';
import type { Order } from '../types';

interface OrdersState {
  items: Order[];
  status: 'idle' | 'loading' | 'error';
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  status: 'idle',
  error: null,
};

const getClient = (state: RootState) => {
  const token = state.auth.accessToken;
  return withAuth(token);
};

export const checkoutOrder = createAsyncThunk<
  Order,
  { address: string },
  { state: RootState; rejectValue: string }
>('orders/checkout', async ({ address }, { getState, rejectWithValue }) => {
  try {
    const client = getClient(getState());
    const res = await client.post<Order>('/orders/checkout', { address });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? 'Checkout failed');
  }
});

export const fetchMyOrders = createAsyncThunk<
  Order[],
  void,
  { state: RootState; rejectValue: string }
>('orders/fetchMy', async (_arg, { getState, rejectWithValue }) => {
  try {
    const client = getClient(getState());
    const res = await client.get<Order[]>('/orders/my');
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? 'Failed to load orders');
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(checkoutOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default ordersSlice.reducer;
