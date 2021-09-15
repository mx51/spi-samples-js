import { configureStore } from '@reduxjs/toolkit';
import spiService from '../services/spiService';
import { getLocalStorage } from '../utils/common/spi/common';
import pairFormReducer from './reducers/PairFormSlice/pairFormSlice';
import productSlice from './reducers/ProductSlice/productSlice';
import terminalReducer from './reducers/TerminalSlice/terminalsSlice';

const recordedTerminals = getLocalStorage('terminals');
const persistedState = JSON.parse(recordedTerminals || '{}');

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['your/action/type'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  reducer: {
    pairForm: pairFormReducer,
    products: productSlice,
    terminals: terminalReducer,
  },
  preloadedState: persistedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

spiService.start(store.dispatch);
