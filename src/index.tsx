import React from 'react';
import ReactDOM from 'react-dom';
// router
import AppRoutes from './router';
import ThemeStyles from './components/Theme';
// redux provider
import ReduxProvider from './redux/ReduxProvider';
// redux store
import { store } from './redux/store';

ReactDOM.render(
  <ThemeStyles>
    <ReduxProvider reduxStore={store}>
      <AppRoutes />
    </ReduxProvider>
  </ThemeStyles>,
  document.getElementById('root')
);
