import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// component
import Navbar from '.';

// mock router path
jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: '/',
  }),
}));

describe('Test <Navbar />', () => {
  test('should contain PageLogoIcon', () => {
    // Arrange
    const { container } = render(<Navbar />);
    // Assert
    expect(container).toBeDefined();
    expect(container.innerHTML.includes('svg')).toBeTruthy();
  });

  test('should be able to view drawer title when PageLogoIcon get clicked', () => {
    // Arrange
    const { getByTestId } = render(<Navbar />);
    // Act
    const navbarMenuIcon = getByTestId('navbarMenuIcon');
    fireEvent.click(navbarMenuIcon);
    // Assert
    // because we test drawer which is out of Navbar component scope (react portal). Thus, we use document.body
    expect(document.body).toHaveTextContent(/Sample POS/i);
  });
});
