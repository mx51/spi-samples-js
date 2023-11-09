import React from 'react';
import { Link } from 'react-router-dom';
import { getSpiVersion } from '../../services/_common/uiHelpers';

import './App.scss';

const App = () => (
  <div className="app">
    <h1 className="bpos-heading">Choose your SPI {getSpiVersion()} POS Sample</h1>
    <nav className="homePageLink">
      <ol>
        <li>
          <a target="_blank" rel="noreferrer" href="https://espressopos.mx51.io">
            Burger POS
          </a>
        </li>
        <li>
          <a target="_blank" rel="noreferrer" href="https://espressopos.mx51.io/">
            Ramen POS
          </a>
        </li>
        <li>
          <a target="_blank" rel="noreferrer" href="https://espressopos.mx51.io/">
            Motel POS
          </a>
        </li>
        <li>
          <Link to="/table">Table POS</Link>
        </li>
      </ol>
    </nav>
  </div>
);

export default App;
