import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi } from '../../services/api'

export const fetchEmailTempData = createAsyncThunk('fetchEmailTempData', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await getApi(user.role === 'superAdmin' ? 'api/email-temp/' : `api/email-temp/?createBy=${user._id}`);
        return response;
    } catch (error) {
        throw error;
    }
});


const emailTempSlice = createSlice({
    name: 'emailTempData',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmailTempData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchEmailTempData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchEmailTempData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default emailTempSlice.reducer;