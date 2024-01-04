import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './roleSlice';

const store = configureStore({
    reducer: {
        roles: roleReducer,
    },
});

export default store;