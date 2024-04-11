import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import roleReducer from './roleSlice';
import imageReducer from './imageSlice';
import userReducer from './localSlice';
import routeReducer from './routeSlice'
import advanceSearchSlice from './advanceSearchSlice';

const userPersistConfig = {
    key: 'userDetails',
    storage,
};
const routePersistConfig = {
    key: 'route',
    storage,
};
const imagesPersistConfig = {
    key: 'image',
    storage,
};


export const store = configureStore({
    reducer: {
        roles: persistReducer(userPersistConfig, roleReducer),
        images: persistReducer(imagesPersistConfig, imageReducer),
        user: userReducer,
        route: persistReducer(routePersistConfig, routeReducer),
        advanceSearchData: advanceSearchSlice,

    },
});

export const persistor = persistStore(store);
