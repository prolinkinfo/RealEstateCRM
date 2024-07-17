import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi } from '../../services/api'

export const fetchPropertyData = createAsyncThunk('fetchPropertyData', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await getApi(user.role === 'superAdmin' ? 'api/property/' : `api/property/?createBy=${user._id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
});

const propertySlice = createSlice({
    name: 'propertyData',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPropertyData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchPropertyData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default propertySlice.reducer;