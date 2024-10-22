import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApi } from 'services/api';

// Assume you have an initialState for roles
const initialState = {
    roles: [],
    user: {}, // Initial empty array for roles
    status: 'idle', // Possible statuses: 'idle', 'loading', 'succeeded', 'failed'
    error: null,
};

// Create an asynchronous thunk
export const fetchRoles = createAsyncThunk('roles/fetchRoles', async (userId) => {
    try {
        const response = await getApi(`api/user/view/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
});

// Create a slice with reducers and the initial state
const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.roles = action?.payload?.roles || []; // Set roles in the state
                state.user = action.payload; // Set roles in the state
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default rolesSlice.reducer;