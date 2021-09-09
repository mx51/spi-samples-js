import { configureStore } from '@reduxjs/toolkit';
import pairReducer from './reducers/pairSlice';
import productSlice from './reducers/ProductSlice/productSlice';
import terminalSlice from './reducers/TerminalSlice/terminalsSlice';

export const store = configureStore({
  reducer: {
    pair: pairReducer,
    terminals: terminalSlice,
    products: productSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
