import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import {
  BUTTON_RED_COLOR,
  DEFAULT_DARK_COLOR,
  DEFAULT_LIGHT_COLOR,
  FIELD_PRESSED_COLOR,
  HOVER_HIGHLIGHT_COLOR,
  NEUTRAL_COLOR,
  PRIMARY_BACKGROUND_COLOR,
  PRIMARY_BORDER_COLOR,
  PRIMARY_ERROR_COLOR,
  PRIMARY_SUCCESS_COLOR,
  PRIMARY_THEME_COLOR,
  PRIMARY_WARNING_COLOR,
  SECONDARY_THEME_COLOR,
  TEXT_DARK_COLOR,
  TEXT_LIGHT_COLOR,
} from '../../definitions/constants/themeStylesConfigs';
import { IThemeStyles } from './interfaces';

const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '*, *:before, *:after': {
          boxSizing: 'inherit',
        },
        html: {
          boxSizing: 'border-box',
          fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(),
          margin: 0,
          WebkitFontSmoothing: 'auto',
        },
      },
    },
    MuiButton: {
      label: {
        fontSize: '.875rem',
        letterSpacing: '0.02rem',
        lineHeight: '1.5rem',
        textTransform: 'none',
      },
    },
    MuiTableCell: {
      root: {
        borderBottomColor: PRIMARY_BORDER_COLOR,
      },
    },
    MuiPaper: {
      root: {
        border: `1px solid ${PRIMARY_BORDER_COLOR}`,
        boxShadow: 'none',
      },
    },
  },
  palette: {
    background: {
      default: PRIMARY_BACKGROUND_COLOR,
    },
    common: {
      black: DEFAULT_DARK_COLOR,
      white: DEFAULT_LIGHT_COLOR,
    },
    error: {
      dark: BUTTON_RED_COLOR,
      main: PRIMARY_ERROR_COLOR,
    },
    info: {
      main: FIELD_PRESSED_COLOR,
    },
    primary: {
      main: PRIMARY_THEME_COLOR,
    },
    secondary: {
      dark: SECONDARY_THEME_COLOR,
      light: HOVER_HIGHLIGHT_COLOR,
      main: PRIMARY_BORDER_COLOR,
    },
    success: {
      main: PRIMARY_SUCCESS_COLOR,
    },
    text: {
      hint: NEUTRAL_COLOR,
      primary: TEXT_DARK_COLOR,
      secondary: TEXT_LIGHT_COLOR,
    },
    warning: {
      main: PRIMARY_WARNING_COLOR,
    },
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
});
function ThemeStyles({ children }: IThemeStyles): React.ReactElement {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
export default ThemeStyles;
