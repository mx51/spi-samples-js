import { alpha, makeStyles, Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: 'calc(100vh - 48px)',
      maxWidth: '80%',
      padding: theme.spacing(3, 0),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    nextButtonRow: {
      marginTop: 'auto',
      display: 'flex',
      justifyContent: 'end',
    },
    nextBtn: {
      padding: theme.spacing(2, 8),
      backgroundColor: theme.palette.error.dark,
      '&:hover, &:active, &:focus': {
        background: alpha(theme.palette.error.dark, 0.75),
        color: theme.palette.common.white,
      },
    },
    nextBtnLabel: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: '1.5rem',
      color: 'white',
    },
  })
);
