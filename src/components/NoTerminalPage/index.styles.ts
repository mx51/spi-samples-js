import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(4, 0, 2, 0),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      lineHeight: theme.spacing(0.5),
      marginTop: theme.spacing(2),
    },
  })
);
export default useStyles;
