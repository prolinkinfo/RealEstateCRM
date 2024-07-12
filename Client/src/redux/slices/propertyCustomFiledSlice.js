import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi } from '../../services/api'

export const fetchPropertyCustomFiled = createAsyncThunk('fetchLeadData', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await getApi(`api/custom-field/?moduleName=Properties`);
        return response;
    } catch (error) {
        throw error;
    }
});


const propertyCustomFiledSlice = createSlice({
    name: 'propertyCustomFiledData',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyCustomFiled.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPropertyCustomFiled.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchPropertyCustomFiled.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default propertyCustomFiledSlice.reducer;