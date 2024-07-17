import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi } from '../../services/api'

export const fetchEmailsData = createAsyncThunk('fetchEmailsData', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await getApi(user.role === 'superAdmin' ? 'api/email/' : `api/email/?sender=${user._id}`);
        return response;
    } catch (error) {
        throw error;
    }
});

const emailsSlice = createSlice({
    name: 'emailsData',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmailsData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchEmailsData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchEmailsData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default emailsSlice.reducer;