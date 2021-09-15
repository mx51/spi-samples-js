import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Terminals from '.';
import ReduxProvider from '../../redux/ReduxProvider';
import { store } from '../../redux/store';

// mock router path
jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: '/terminals',
  }),
}));

describe('Test <Terminals />', () => {
  test('should contain Terminal list heading', () => {
    // Arrange
    const { container } = render(
      <ReduxProvider reduxStore={store}>
        <Terminals />
      </ReduxProvider>
    );
    // Assert
    expect(container.getElementsByTagName('h1')[0]).toHaveTextContent('Terminals list');
  });
});
