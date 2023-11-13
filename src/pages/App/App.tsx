import React from 'react';
import { Link } from 'react-router-dom';
import { getSpiVersion } from '../../services/_common/uiHelpers';

import './App.scss';

const espressoUrl = window.location.origin.includes('rebuild')
  ? 'https://dev.espressopos.mx51.io'
  : 'https://espressopos.mx51.io';

const App = () => (
  <div className="app">
    <h1 className="bpos-heading">Choose your SPI {getSpiVersion()} POS Sample</h1>
    <nav className="homePageLink">
      <ol>
        <li>
          <a target="_blank" rel="noreferrer" href={espressoUrl}>
            Burger POS
          </a>
        </li>
        <li>
          <a target="_blank" rel="noreferrer" href={espressoUrl}>
            Ramen POS
          </a>
        </li>
        <li>
          <a target="_blank" rel="noreferrer" href={espressoUrl}>
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
