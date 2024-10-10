import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableHeading: {
      marginTop: theme.spacing(2),
      fontWeight: 600,
      fontSize: '1.125rem',
      padding: theme.spacing(2),
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      borderTopLeftRadius: theme.spacing(0.5),
      borderTopRightRadius: theme.spacing(0.5),
      borderBottom: 'none',
      width: '100%',
    },
    pairingIcon: {
      display: 'inline-block',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      marginRight: theme.spacing(1),
    },
  })
);

export default useStyles;
