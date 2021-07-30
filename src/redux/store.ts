import { configureStore } from '@reduxjs/toolkit';
import pairReducer from './reducers/pairSlice';

export const store = configureStore({
  reducer: {
    pair: pairReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
