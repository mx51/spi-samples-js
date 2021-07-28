import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    spiModalHeading: {
      fontSize: '1.125rem',
      marginBottom: -theme.spacing(1),
    },
    spiModalSubHeading: {
      color: theme.palette.text.secondary,
      fontSize: '0.875rem',
      fontWeight: 300,
      margin: theme.spacing(0, 3, 2, 3),
    },
  })
);

export default useStyles;
