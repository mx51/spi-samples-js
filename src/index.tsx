import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from './pages/App';
import TablePos from './pages/Table';
import SupportTools from './pages/SupportTools';

import './index.scss';

const redirectToExpresso = () => {
  if (window.location.origin.includes('rebuild')) {
    window.location.href = 'https://dev.espressopos.mx51.io';
  } else {
    window.location.href = 'https://espressopos.mx51.io';
  }
  return null;
};

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/">
        <App />
      </Route>
      <Route path="/table">
        <TablePos />
      </Route>
      <Route path="/burger" component={redirectToExpresso} />
      <Route path="/ramen" component={redirectToExpresso} />
      <Route path="/motel" component={redirectToExpresso} />
      <Route path="/support-tools">
        <SupportTools />
      </Route>
    </Switch>
  </BrowserRouter>
);

ReactDOM.render(<Routes />, document.getElementById('root'));
