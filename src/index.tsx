import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from './pages/App';
import BurgerPos from './pages/Burger';
import MotelPos from './pages/Motel';
import RamenPos from './pages/Ramen';
import TablePos from './pages/Table';

import './index.scss';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/">
        <App />
      </Route>
      <Route path="/burger">
        <BurgerPos />
      </Route>
      <Route path="/motel">
        <MotelPos />
      </Route>
      <Route path="/ramen">
        <RamenPos />
      </Route>
      <Route path="/table">
        <TablePos />
      </Route>
    </Switch>
  </BrowserRouter>
);

ReactDOM.render(<Routes />, document.getElementById('root'));
