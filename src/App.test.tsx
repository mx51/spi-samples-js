import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders text "SPI Sample POS"', () => {
  render(<App />);
  const linkElement = screen.getByText(/SPI Sample POS/i);
  expect(linkElement).toBeInTheDocument();
});
