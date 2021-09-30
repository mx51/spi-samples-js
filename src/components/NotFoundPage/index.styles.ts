import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: `calc(100vh - 48px)`,
    },
    title: {
      fontSize: '2rem',
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(1),
    },
    subtitle: {
      marginBottom: theme.spacing(4),
    },
  })
);
export default useStyles;
