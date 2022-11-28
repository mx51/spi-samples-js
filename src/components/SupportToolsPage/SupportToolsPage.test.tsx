import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';
import SupportToolsPage from '.';
import ReduxProvider from '../../redux/ReduxProvider';
import { store } from '../../redux/store';

describe('Test <SupportToolsPage />', () => {
  test('snapshot for SupportToolsPage component', () => {
    // Act
    const { container } = render(
      <ReduxProvider reduxStore={store}>
        <Router>
          <SupportToolsPage />
        </Router>
      </ReduxProvider>
    );
    // Assert
    expect(container).toMatchSnapshot();
  });
});
