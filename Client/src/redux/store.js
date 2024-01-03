import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './roleSlice';

const store = configureStore({
    reducer: {
        roles: roleReducer,
        // Add other reducers here
    },
    // Add middleware here, if any
});

export default store;