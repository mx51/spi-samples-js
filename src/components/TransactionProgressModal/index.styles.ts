import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modalHeading: {
      fontWeight: 500,
      fontSize: '1.125rem',
      color: theme.palette.text.secondary,
    },
    modalSubHeading: {
      fontWeight: 500,
      fontSize: '1.5rem',
      color: theme.palette.text.primary,
    },
    modalBtn: {
      marginTop: '2rem',
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
