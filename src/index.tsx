import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// router
import AppRoutes from './router';
import ThemeStyles from './components/Theme';
// store
import { store } from './redux/store';

ReactDOM.render(
  <ThemeStyles>
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  </ThemeStyles>,
  document.getElementById('root')
);
