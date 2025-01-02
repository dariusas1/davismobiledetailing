import { configureStore } from '@reduxjs/toolkit';
import { 
    persistStore, 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// Import reducers
import authReducer from './authSlice';
import bookingReducer from './bookingSlice';
import servicesReducer from './servicesSlice';
import userProfileReducer from './userProfileSlice';

// Persist configuration
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth', 'userProfile'] // Only these will be persisted
};

// Combine and persist reducers
const persistedReducer = persistReducer(persistConfig, 
    combineReducers({
        auth: authReducer,
        booking: bookingReducer,
        services: servicesReducer,
        userProfile: userProfileReducer
    })
);

// Create store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER
                ]
            }
        })
});

// Create persistor
const persistor = persistStore(store);

export { store, persistor };
