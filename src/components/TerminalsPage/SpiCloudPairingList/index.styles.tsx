import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
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
    container: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      border: `1px solid ${theme.palette.divider}`,
      borderBottomRightRadius: theme.spacing(0.5),
      borderBottomLeftRadius: theme.spacing(0.5),
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Adjust transparency as needed
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10, // Ensure it overlays the content
    },
  })
);

export default useStyles;
