import React from 'react';
import ReactDOM from 'react-dom';
// components
import Layout from './Components/Templates/Layout';
import ThemeStyles from './Components/Templates/ThemeStyles';

ReactDOM.render(
  <ThemeStyles>
    <Layout />
  </ThemeStyles>,
  document.getElementById('root')
);
