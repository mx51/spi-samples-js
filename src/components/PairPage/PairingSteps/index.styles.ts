import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pairingStepsBox: {
      padding: theme.spacing(2),
      border: `1px solid ${theme.palette.secondary.main}`,
      borderRadius: theme.spacing(0.5),
      background: theme.palette.common.white,
    },
    pairingStepsHeader: {
      fontSize: '1.25rem',
      fontWeight: 400,
    },
    pairingStepsOl: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      paddingLeft: theme.spacing(2),
      '& li': {
        marginBottom: theme.spacing(1),
      },
    },
  })
);

export default useStyles;
