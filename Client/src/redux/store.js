import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './roleSlice';
import imageReducer from './imageSlice';

const store = configureStore({
    reducer: {
        roles: roleReducer,
        images: imageReducer
    },
});

export default store;