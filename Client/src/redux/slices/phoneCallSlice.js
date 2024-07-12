import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi } from '../../services/api'

export const fetchPhoneCallData = createAsyncThunk('fetchPhoneCallData', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await getApi(user.role === 'superAdmin' ? 'api/phoneCall' : `api/phoneCall?sender=${user._id}`);
        return response;
    } catch (error) {
        throw error;
    }
});

const phoneCallSlice = createSlice({
    name: 'phoneCallData',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPhoneCallData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPhoneCallData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchPhoneCallData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default phoneCallSlice.reducer;