import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../api/client';
import type { Product } from '../types';

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'error';
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('products/fetchAll', async (_arg, { rejectWithValue }) => {
  try {
    const res = await api.get<Product[]>('/products');
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? 'Failed to load products');
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Error';
      });
  },
});

export default productsSlice.reducer;
