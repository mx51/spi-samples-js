import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
      position: 'relative',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      position: 'absolute',
    },
    marginRight: {
      marginRight: theme.spacing(2),
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
