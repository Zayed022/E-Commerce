import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { withAuth } from '../api/client';
import type { CartItem } from '../types';
import type { RootState } from './index';

interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'error';
  error: string | null;
}

const initialState: CartState = {
  items: [],
  status: 'idle',
  error: null,
};

const getClient = (state: RootState) => {
  const token = state.auth.accessToken;
  return withAuth(token);
};

export const fetchCart = createAsyncThunk<
  CartItem[],
  void,
  { state: RootState; rejectValue: string }
>('cart/fetch', async (_arg, { getState, rejectWithValue }) => {
  try {
    const client = getClient(getState());
    const res = await client.get<CartItem[]>('/cart');
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? 'Failed to load cart');
  }
});

export const addToCart = createAsyncThunk<
  CartItem,
  { productId: string; quantity: number },
  { state: RootState; rejectValue: string }
>('cart/add', async (payload, { getState, rejectWithValue }) => {
  try {
    const client = getClient(getState());
    const res = await client.post<CartItem>('/cart/add', payload);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? 'Failed to add to cart');
  }
});

export const updateCartQuantity = createAsyncThunk<
  CartItem,
  { id: string; quantity: number },
  { state: RootState; rejectValue: string }
>('cart/updateQuantity', async ({ id, quantity }, { getState, rejectWithValue }) => {
  try {
    const client = getClient(getState());
    const res = await client.patch<CartItem>(`/cart/${id}`, { quantity });
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? 'Failed to update cart');
  }
});

export const removeCartItem = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>('cart/remove', async (id, { getState, rejectWithValue }) => {
  try {
    const client = getClient(getState());
    await client.delete(`/cart/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? 'Failed to remove item');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearLocalCart(state) {
      state.items = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export const { clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
