import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Navbar from '.';

describe('Test <Navbar />', () => {
  test('component contains PageLogoIcon', () => {
    // Arrange
    const { container } = render(<Navbar />);
    // Assert
    expect(container).toBeDefined();
    expect(container.innerHTML.includes('svg')).toBeTruthy();
  });
});
