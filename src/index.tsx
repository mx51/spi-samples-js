import React from 'react';
import ReactDOM from 'react-dom';
// components
import Layout from './components/templates/Layout';
import ThemeStyles from './components/templates/ThemeStyles';

ReactDOM.render(
  <ThemeStyles>
    <Layout />
  </ThemeStyles>,
  document.getElementById('root')
);
