import React from 'react';
import ReactDOM from 'react-dom';
import { PersistGate } from 'redux-persist/integration/react';

import ThemeStyles from './components/Theme';
import ReduxProvider from './redux/ReduxProvider';
import { persistor, store } from './redux/store';

import AppRoutes from './router';
import CurrentEnvInitializer from './components/CurrentEnvInitializer/CurrentEnvInitialiser';

ReactDOM.render(
  <ThemeStyles>
    <ReduxProvider reduxStore={store}>
      <CurrentEnvInitializer />
      <PersistGate loading={null} persistor={persistor}>
        <AppRoutes />
      </PersistGate>
    </ReduxProvider>
  </ThemeStyles>,
  document.getElementById('root')
);
