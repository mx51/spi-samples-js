import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

interface ThemeStylesInterface {
  children: React.ReactNode;
}

interface ThemePropsInterface {
  theme: {
    fontFamily?: string;
  };
}

const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${(props: ThemePropsInterface) => props.theme.fontFamily};
  }
`;

const ThemeStyles: React.FC<ThemeStylesInterface> = ({ children }) => (
  <ThemeProvider theme={{ fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join() }}>
    <GlobalStyle />
    {children}
  </ThemeProvider>
);

export default ThemeStyles;
