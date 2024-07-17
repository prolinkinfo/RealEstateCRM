import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import roleReducer from './slices/roleSlice';
import imageReducer from './slices/imageSlice';
import userReducer from './slices/localSlice';
import routeReducer from './slices/routeSlice';
import advanceSearchSlice from './slices/advanceSearchSlice';
import leadSlice from './slices/leadSlice'
import propertyCustomFiledSlice from './slices/propertyCustomFiledSlice';
import propertySlice from './slices/propertySlice';
import contactSlice from './slices/contactSlice';
import contactCustomFiledSlice from './slices/contactCustomFiledSlice';
import leadCustomFiledSlice from './slices/leadCustomFiledSlice';
import taskSlice from './slices/taskSlice';
import meetingSlice from './slices/meetingSlice';
import emailsSlice from './slices/emailsSlice';
import emailTempSlice from './slices/emailTempSlice';
import opportunitySlice from './slices/opportunitySlice';
import moduleSlice from './slices/moduleSlice';
import accountSlice from './slices/accountSlice';
import quotesSlice from './slices/quotesSlice';
import invoicesSlice from './slices/invoicesSlice';

const middleware = (getDefaultMiddleware) => {
  return getDefaultMiddleware({
    serializableCheck: false,
  });
};

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
const leadPersistConfig = {
  key: 'lead',
  storage,
};
const contactPersistConfig = {
  key: 'contact',
  storage,
};

export const store = configureStore({
  reducer: {
    roles: persistReducer(userPersistConfig, roleReducer),
    modules: moduleSlice,
    images: persistReducer(imagesPersistConfig, imageReducer),
    user: userReducer,
    route: persistReducer(routePersistConfig, routeReducer),
    advanceSearchData: advanceSearchSlice,
    leadData: persistReducer(leadPersistConfig, leadSlice),
    contactData: persistReducer(contactPersistConfig, contactSlice),
    propertyCustomFiled: propertyCustomFiledSlice,
    contactCustomFiled: contactCustomFiledSlice,
    leadCustomFiled: leadCustomFiledSlice,
    propertyData: propertySlice,
    taskData: taskSlice,
    meetingData: meetingSlice,
    emailsData: emailsSlice,
    emailTempData: emailTempSlice,
    opportunityData: opportunitySlice,
    accountData: accountSlice,
    quotesData: quotesSlice,
    invoicesData: invoicesSlice,
  },
  middleware,
});

export const persistor = persistStore(store);
