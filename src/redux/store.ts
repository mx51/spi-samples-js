import { AnyAction, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/es/stateReconciler/hardSet';
import spiService from '../services/spiService';
import { getLocalStorage } from '../utils/common/spi/common';
import commonReducer from './reducers/CommonSlice/commonSlice';
import pairFormReducer from './reducers/PairFormSlice/pairFormSlice';
import { preAuthReducer } from './reducers/PreAuth/preAuthSlice';
import productSlice from './reducers/ProductSlice/productSlice';
import selectedTerminalReducer from './reducers/SelectedTerminalSlice/selectedTerminalSlice';
import terminalReducer from './reducers/TerminalSlice/terminalsSlice';
import { IPreAuthState } from './reducers/PreAuth/interfaces';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: hardSet,
};

const persistedPreAuthReducer = persistReducer<IPreAuthState, AnyAction>(persistConfig, preAuthReducer);

const persistedState = JSON.parse(getLocalStorage('terminals') || '{}');

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: process.env.NODE_ENV === 'development',
    }),
  reducer: {
    common: commonReducer,
    pairForm: pairFormReducer,
    products: productSlice,
    terminals: terminalReducer,
    selectedTerminal: selectedTerminalReducer,
    preAuth: persistedPreAuthReducer,
  },
  preloadedState: persistedState,
  devTools: process.env.NODE_ENV === 'development',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

spiService.start(store.dispatch);
