import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.primary.main,
      },
      padding: theme.spacing(3),
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    lookupContainer: {
      backgroundColor: theme.palette.common.white,
      borderRadius: theme.spacing(0.5),
      border: `1px solid ${theme.palette.secondary.main}`,
      padding: theme.spacing(2),
    },

    h1: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    divider: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
  })
);

export default useStyles;
