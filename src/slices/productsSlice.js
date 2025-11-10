import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'https://dummyjson.com';

const loadLocal = () => JSON.parse(localStorage.getItem('localProducts') || '[]');
const saveLocal = (data) => localStorage.setItem('localProducts', JSON.stringify(data));

export const fetchProducts = createAsyncThunk('products/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_BASE}/products?limit=200`);
    const apiProducts = res.data.products || [];

    const local = loadLocal();

    const merged = [...apiProducts, ...local];
    return { products: merged, total: merged.length };
  } catch (err) {
    return rejectWithValue(err.message || 'Could not fetch products');
  }
});

export const addProduct = createAsyncThunk('products/add', async (product, { getState, rejectWithValue }) => {
  try {
    const state = getState().products;
    const allItems = state.items || [];

    const maxId = allItems.reduce((max, p) => Math.max(max, p.id), 0);
    const newId = maxId + 1;

    const newProduct = { id: newId, ...product, local: true };

    const local = loadLocal();
    local.push(newProduct);
    saveLocal(local);

    return newProduct;
  } catch (err) {
    return rejectWithValue(err.message || 'Add product failed');
  }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const local = loadLocal();
    const idx = local.findIndex(p => p.id === id);

    if (idx !== -1) {
      local[idx] = { ...local[idx], ...data };
    } else {
      local.push({ id, ...data, local: true });
    }

    saveLocal(local);
    return { id, ...data };
  } catch (err) {
    return rejectWithValue(err.message || 'Update failed');
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    const local = loadLocal().filter(p => p.id !== id);
    saveLocal(local);
    return { id };
  } catch (err) {
    return rejectWithValue(err.message || 'Delete failed');
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.total = state.items.length;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload.id);
        state.total = state.items.length;
      });
  },
});

export default productsSlice.reducer;
