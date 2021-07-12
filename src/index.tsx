import React from 'react';
import ReactDOM from 'react-dom';
// router
import AppRoutes from './Router';
import ThemeStyles from './Components/Templates/ThemeStyles';

ReactDOM.render(
  <ThemeStyles>
    <AppRoutes />
  </ThemeStyles>,
  document.getElementById('root')
);
