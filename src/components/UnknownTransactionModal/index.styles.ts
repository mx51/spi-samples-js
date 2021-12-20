import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modalHeading: {
      fontWeight: 500,
      fontSize: '1.5rem',
      padding: theme.spacing(1),
      color: theme.palette.text.primary,
    },
    modalSublHeading: {
      fontWeight: 500,
      fontSize: '1.125rem',
      color: theme.palette.text.secondary,
    },
    modalBtn: {
      margin: theme.spacing(3, 1, 1),
    },
    transactionProgressModalContnent: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(5),
    },
    modalImage: {
      margin: theme.spacing(1),
    },
  })
);

export default useStyles;
