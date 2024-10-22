import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: JSON.parse(window.localStorage.getItem('user')),
};

const localSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            // You can also update localStorage here if needed
        },
        clearUser: (state) => {
            state.user = null;
            // You can also update localStorage here if needed
        },
    },
});

export const { setUser, clearUser } = localSlice.actions;

export default localSlice.reducer;