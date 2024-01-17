import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import commonReducer from '../../redux/reducers/CommonSlice/commonSlice';
import pairFormReducer from '../../redux/reducers/PairFormSlice/pairFormSlice';
import produceReducer from '../../redux/reducers/ProductSlice/productSlice';
import terminalReducer from '../../redux/reducers/TerminalSlice/terminalsSlice';
import selectedTerminalReducer from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSlice';
import { preAuthReducer } from '../../redux/reducers/PreAuth/preAuthSlice';
import { payAtTableReducer } from '../../redux/reducers/PayAtTableSlice/payAtTableSlice';

const rootReducer = combineReducers({
  common: commonReducer,
  pairForm: pairFormReducer,
  products: produceReducer,
  terminals: terminalReducer,
  selectedTerminal: selectedTerminalReducer,
  preAuth: preAuthReducer,
  payAtTable: payAtTableReducer,
});

function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV === 'development',
    preloadedState,
  });
}
type RootState = ReturnType<typeof rootReducer>;
type AppStore = ReturnType<typeof setupStore>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<unknown>): JSX.Element {
    return (
      <Provider store={store}>
        <Router>{children}</Router>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
