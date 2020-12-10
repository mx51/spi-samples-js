import { configureStore } from '@reduxjs/toolkit';
import SPI from '../../pages/Burger/spi';

import rootReducer from '../reducers/index';

const data = window.localStorage.getItem('reduxPosState');
const persistedState = JSON.parse(data || '{}');
SPI.initalizeInstances(persistedState);

const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
});

store.subscribe(() => {
  window.localStorage.setItem('reduxPosState', JSON.stringify(store.getState()));
});

export default store;
