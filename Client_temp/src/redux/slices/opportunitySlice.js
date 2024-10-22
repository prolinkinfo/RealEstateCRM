import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getApi } from '../../services/api'

export const fetchOpportunityData = createAsyncThunk('fetchOpportunityData', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await getApi(user.role === 'superAdmin' ? 'api/opportunity/' : `api/opportunity/?createBy=${user._id}`);
        return response;
    } catch (error) {
        throw error;
    }
});


const opportunitySlice = createSlice({
    name: 'opportunityData',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOpportunityData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchOpportunityData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchOpportunityData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default opportunitySlice.reducer;