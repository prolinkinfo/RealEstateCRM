
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi } from 'services/api';

export const fetchContactData = createAsyncThunk('fetchContactData', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await getApi(user.role === 'superAdmin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
});


const getContactSlice = createSlice({
    name: 'contactData',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContactData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchContactData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchContactData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default getContactSlice.reducer;