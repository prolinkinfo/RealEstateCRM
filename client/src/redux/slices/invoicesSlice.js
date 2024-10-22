import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi } from '../../services/api'

export const fetchInvoicesData = createAsyncThunk('fetchInvoicesData', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await getApi(user.role === 'superAdmin' ? 'api/invoices/' : `api/invoices/?createBy=${user._id}`);
        return response;
    } catch (error) {
        throw error;
    }
});


const invoicesSlice = createSlice({
    name: 'invoiceData',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvoicesData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchInvoicesData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchInvoicesData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default invoicesSlice.reducer;