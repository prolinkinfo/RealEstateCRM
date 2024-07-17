import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi } from '../../services/api'

export const fetchContactCustomFiled = createAsyncThunk('fetchContactCustomFiled', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await getApi(`api/custom-field/?moduleName=Contacts`);
        return response;
    } catch (error) {
        throw error;
    }
});


const contactCustomFiledSlice = createSlice({
    name: 'contactCustomFiledData',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContactCustomFiled.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchContactCustomFiled.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchContactCustomFiled.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default contactCustomFiledSlice.reducer;