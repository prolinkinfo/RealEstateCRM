import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApi } from 'services/api';

// Assume you have an initialState for roles
const initialState = {
    image: [], // Initial empty array for roles
    status: 'idle', // Possible statuses: 'idle', 'loading', 'succeeded', 'failed'
    error: null,
};

// Create an asynchronous thunk
export const fetchImage = createAsyncThunk('roles/fetchRoles', async (active) => {
    try {
        const response = await getApi(`api/images/${active ? active : ""}`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error;
    }
});

// Create a slice with reducers and the initial state
const imageSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchImage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchImage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.image = action.payload; // Set roles in the state
            })
            .addCase(fetchImage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default imageSlice.reducer;