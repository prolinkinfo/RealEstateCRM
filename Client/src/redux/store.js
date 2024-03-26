import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './roleSlice';
import imageReducer from './imageSlice';
import userReducer from './localSlice';
import routeReducer from './routeSlice'

const store = configureStore({
    reducer: {
        roles: roleReducer,
        images: imageReducer,
        user: userReducer,
        route: routeReducer
    },
});

export default store;