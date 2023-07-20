import { configureStore } from '@reduxjs/toolkit';
import spiService from '../services/spiService';
import { getLocalStorage } from '../utils/common/spi/common';
import commonReducer from './reducers/CommonSlice/commonSlice';
import pairFormReducer from './reducers/PairFormSlice/pairFormSlice';
import preAuthReducer from './reducers/PreAuth/preAuthSlice';
import productSlice from './reducers/ProductSlice/productSlice';
import selectedTerminalReducer from './reducers/SelectedTerminalSlice/selectedTerminalSlice';
import terminalReducer from './reducers/TerminalSlice/terminalsSlice';

const recordedTerminals = getLocalStorage('terminals');
const persistedState = JSON.parse(recordedTerminals || '{}');

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
    preAuth: preAuthReducer,
  },
  preloadedState: persistedState,
  devTools: process.env.NODE_ENV === 'development',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

spiService.start(store.dispatch);
