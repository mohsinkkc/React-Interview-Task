import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE = 'https://dummyjson.com'

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await axios.post(`https://dummyjson.com/auth/login`, credentials, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
  } catch (err) {
    const localUser = JSON.parse(localStorage.getItem('registeredUser') || 'null');
    if (localUser && localUser.username === credentials.username && localUser.password === credentials.password) {
      return { ...localUser, token: 'local-fake-token' };
    }
    const message = err?.response?.data?.message || 'Invalid credentials';
    return rejectWithValue(message);
  }
});


export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const fakeUser = {
      ...payload,
      id: Math.floor(Math.random() * 10000),
      token: 'fake-jwt-token-for-demo'
    };
    localStorage.setItem('registeredUser', JSON.stringify(fakeUser));
    return fakeUser;
  } catch (err) {
    return rejectWithValue('Registration failed');
  }
});


const tokenFromStorage = localStorage.getItem('token') || null
const userFromStorage = JSON.parse(localStorage.getItem('user') || 'null')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage,
    token: tokenFromStorage,
    loading: false,
    error: null
  },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true; state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Login failed'
      })
      .addCase(register.pending, (state) => {
        state.loading = true; state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Registration failed'
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
