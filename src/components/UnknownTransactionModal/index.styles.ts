import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modalHeading: {
      fontWeight: 500,
      fontSize: '1.5rem',
      padding: '1rem',
      color: theme.palette.text.primary,
    },
    modalSublHeading: {
      fontWeight: 500,
      fontSize: '1.125rem',
      color: theme.palette.text.secondary,
    },
    modalBtn: {
      margin: theme.spacing(3, 1, 1, 1),
    },
    transactionProgressModalContnent: {
      width: '27.5rem',
      height: '19.6rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalImage: {
      margin: '1rem',
    },
  })
);

export default useStyles;
