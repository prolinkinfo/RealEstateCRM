import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './roleSlice';
import imageReducer from './imageSlice';
import userReducer from './localSlice';

const store = configureStore({
    reducer: {
        roles: roleReducer,
        images: imageReducer,
        user: userReducer
    },
});

export default store;