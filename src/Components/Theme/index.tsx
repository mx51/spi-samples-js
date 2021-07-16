import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
// interfaces
import { ThemePropsInterface, ThemeStylesInterface } from './interfaces';
// constants
import { PRIMARY_COLOR } from '../../definitions/constants/themeStylesConfigs';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    box-sizing: border-box;
    font-family: ${(props: ThemePropsInterface) => props.theme.fontFamily};
    color: ${PRIMARY_COLOR};
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }
`;

function ThemeStyles({ children }: ThemeStylesInterface): React.ReactElement {
  return (
    <ThemeProvider theme={{ fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join() }}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}

export default ThemeStyles;
