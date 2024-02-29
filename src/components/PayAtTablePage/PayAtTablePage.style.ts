import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const usePayAtTableStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(7),
      paddingBottom: theme.spacing(7),
    },
    addButton: {
      position: 'absolute',
      right: theme.spacing(7),
      bottom: theme.spacing(7),
    },
    cardContainer: {
      maxWidth: '300px',
    },

    iconContainer: {
      display: 'flex',
    },
    successIcon: {
      color: theme.palette.success.main,
      margin: theme.spacing(1),
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '20px',
      height: '20px',
    },
    failedIcon: {
      color: theme.palette.error.main,
      margin: theme.spacing(1),
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '20px',
      height: '20px',
    },
    unknownIcon: {
      color: theme.palette.warning.main,
      margin: theme.spacing(1),
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '20px',
      height: '20px',
    },
    spacing: {
      paddingTop: theme.spacing(4),
    },
    noTxContainer: {
      padding: theme.spacing(4),
      display: 'flex',
      justifyContent: 'center',
    },
  })
);
