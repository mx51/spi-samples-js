import { makeStyles, Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panel: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing(2),
    },
    label: {
      fontSize: '3rem',
      fontWeight: 300,
    },
    amount: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80px',
      border: 'none',
      padding: '0 2rem',
      fontSize: '3rem',
      fontWeight: 'normal',
    },
  })
);
