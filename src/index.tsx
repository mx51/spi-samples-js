import React from 'react';
import ReactDOM from 'react-dom';
// components
import App from './App';
import ThemeStyles from './components/templates/ThemeStyles';

ReactDOM.render(
  <ThemeStyles>
    <App />
  </ThemeStyles>,
  document.getElementById('root')
);
