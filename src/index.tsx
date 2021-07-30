import React from 'react';
import ReactDOM from 'react-dom';
import ThemeStyles from './components/Theme';
import ReduxProvider from './redux/ReduxProvider';
import { store } from './redux/store';
import AppRoutes from './router';

ReactDOM.render(
  <ThemeStyles>
    <ReduxProvider reduxStore={store}>
      <AppRoutes />
    </ReduxProvider>
  </ThemeStyles>,
  document.getElementById('root')
);
