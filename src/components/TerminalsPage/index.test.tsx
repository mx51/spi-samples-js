import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// component
import Terminals from '.';

// mock router path
jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: '/terminals',
  }),
}));

describe('Test <Terminals />', () => {
  test('should contain Terminal list heading', () => {
    // Arrange
    const { container } = render(<Terminals />);
    // Assert
    expect(container.getElementsByTagName('h1')[0]).toHaveTextContent('Terminals list');
  });
});
