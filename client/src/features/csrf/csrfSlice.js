import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCrf } from '../../api/auth';

export const getCSRFToken = createAsyncThunk('csrf/getToken', async () => {
    const token = await fetchCrf();
    return token.csrfToken;
});

const csrfSlice = createSlice({
    name: 'csrf',
    initialState: {
        token: '',
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCSRFToken.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCSRFToken.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
            })
            .addCase(getCSRFToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default csrfSlice.reducer;