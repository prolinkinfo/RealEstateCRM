import { configureStore } from '@reduxjs/toolkit';
import roleReducer from './roleSlice';
import imageReducer from './imageSlice';
import userReducer from './localSlice';
import routeReducer from './routeSlice'
import advanceSearchSlice from './advanceSearchSlice';

const store = configureStore({
    reducer: {
        roles: roleReducer,
        images: imageReducer,
        user: userReducer,
        route: routeReducer,
        advanceSearchData: advanceSearchSlice,
    },
});

export default store;