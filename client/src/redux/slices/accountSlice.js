import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi } from '../../services/api'

export const fetchAccountData = createAsyncThunk('fetchAccountData', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await getApi(user.role === 'superAdmin' ? 'api/account/' : `api/account/?createBy=${user._id}`);
        return response;
    } catch (error) {
        throw error;
    }
});


const accountSlice = createSlice({
    name: 'accountData',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccountData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAccountData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchAccountData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default accountSlice.reducer;