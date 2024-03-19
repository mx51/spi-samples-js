import { makeStyles, Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import { FONT_COLOR } from '../../../definitions/constants/themeStylesConfigs';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    keypadDrawerPaper: {
      width: '33.34%',
      backgroundColor: 'transparent',
      border: 0,
    },
    dividerLabel: {
      marginTop: theme.spacing(4.5),
      marginBottom: theme.spacing(0.5),
      color: FONT_COLOR,
    },
    divider: {
      marginBottom: theme.spacing(2),
    },
    panel: {
      display: 'flex',
      alignItems: 'center',
    },
    splitAmountButton: {
      backgroundColor: 'rgba(57, 63, 115, 0.1)',
      borderRadius: '8px',
    },
    splitAmountButtonLabel: {
      fontWeight: 400,
      fontSize: '3rem',
      lineHeight: '4rem',
    },
    outstandingAmount: {
      marginLeft: 'auto',
      display: 'inline-flex',
      alignItems: 'end',
      height: '36px',
      color: FONT_COLOR,
    },
    errorText: {
      marginTop: theme.spacing(1),
    },
  })
);
