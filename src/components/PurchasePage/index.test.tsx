import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';
import PurchasePage from '.';
import ReduxProvider from '../../redux/ReduxProvider';
import { store } from '../../redux/store';

describe('Test <PurchasePage />', () => {
  test('snapshot for PurchasePage component', () => {
    const { container } = render(
      <ReduxProvider reduxStore={store}>
        <Router>
          <PurchasePage />
        </Router>
      </ReduxProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
