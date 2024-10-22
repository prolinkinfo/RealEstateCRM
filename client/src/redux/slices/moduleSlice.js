import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApi } from 'services/api';

// Assume you have an initialState for roles
const initialState = {
    data: [],
    status: 'idle',
    error: null,
};

// Create an asynchronous thunk
export const fetchModules = createAsyncThunk('modules', async () => {
    try {
        const response = await getApi(`api/modules`);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// Create a slice with reducers and the initial state
const moduleSlice = createSlice({
    name: 'modules',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchModules.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchModules.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchModules.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default moduleSlice.reducer;