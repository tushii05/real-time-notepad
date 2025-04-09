import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUser, logOut } from '../../api/auth';

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  try {
    const res = await fetchUser();
    return res || null;
  } catch (error) {
    console.log("Authentication check failed:", error);
    return null;
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await logOut();
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
    sessionExpiresAt: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.sessionExpiresAt = action.payload?.sessionExpiresAt || null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.sessionExpiresAt = null;
      });
  },
});

export default authSlice.reducer;