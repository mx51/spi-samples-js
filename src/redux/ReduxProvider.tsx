import React from 'react';
import { Provider } from 'react-redux';
// store
import { store } from './store';

interface ReduxProviderInterface {
  children: React.ReactNode;
  reduxStore: typeof store;
}

function ReduxProvider({ children, reduxStore }: ReduxProviderInterface): React.ReactElement {
  return <Provider store={reduxStore}>{children}</Provider>;
}

export default ReduxProvider;
