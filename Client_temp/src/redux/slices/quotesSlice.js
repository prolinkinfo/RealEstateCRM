import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi } from '../../services/api'

export const fetchQuotesData = createAsyncThunk('fetchQuotesData', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await getApi(user.role === 'superAdmin' ? 'api/quotes/' : `api/quotes/?createBy=${user._id}`);
        return response;
    } catch (error) {
        throw error;
    }
});


const quotesSlice = createSlice({
    name: 'quotesData',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuotesData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchQuotesData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchQuotesData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default quotesSlice.reducer;