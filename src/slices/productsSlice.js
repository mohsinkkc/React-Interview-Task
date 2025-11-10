import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE = 'https://dummyjson.com'

export const fetchProducts = createAsyncThunk('products/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_BASE}/products`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.message || 'Could not fetch products')
  }
})

export const addProduct = createAsyncThunk('products/add', async (product, { rejectWithValue }) => {
  try {
    // DummyJSON supports adding product via /products/add but it's ok to simulate
    const res = await axios.post(`${API_BASE}/products/add`, product)
    return res.data
  } catch (err) {
    return rejectWithValue(err.message || 'Add product failed')
  }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${API_BASE}/products/${id}`, data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.message || 'Update failed')
  }
})

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`${API_BASE}/products/${id}`)
    return { id }
  } catch (err) {
    return rejectWithValue(err.message || 'Delete failed')
  }
})

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.products || []
        state.total = action.payload.total || state.items.length
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false; state.error = action.payload
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
        state.total += 1
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex(p => p.id === action.payload.id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload.id)
        state.total = state.items.length
      })
  }
})

export default productsSlice.reducer
