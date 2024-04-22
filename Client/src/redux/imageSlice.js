import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApi } from 'services/api';

const initialState = {
    images: [],
    status: 'idle',
    error: null,
};

// Create an asynchronous thunk
export const fetchImage = createAsyncThunk('images/fetchImage', async (active, { dispatch, getState }) => {
    dispatch(fetchImage.pending());
    try {
        const response = await getApi(`api/images/${active ? active : ""}`);
        dispatch(fetchImage.fulfilled(response.data));
        return response.data;
    } catch (error) {
        dispatch(fetchImage.rejected(error));
        throw error;
    }
});
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
                state.images = action.payload;
                state.error = null; // Reset error on successful fetch
            })
            .addCase(fetchImage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default imageSlice.reducer;

