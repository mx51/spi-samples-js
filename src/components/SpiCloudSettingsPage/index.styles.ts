import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
      position: 'relative',
    },
    backLink: {
      marginBottom: '16px',
    },
    backLinkText: {
      fontSize: '20px',
      marginLeft: '10px',
    },
    defaultMargin: {
      marginTop: '0px',
      marginBottom: theme.spacing(3),
    },
    cancelPairingBtn: {
      background: theme.palette.common.white,
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      fontWeight: 300,
      marginLeft: theme.spacing(0.5),
      textTransform: 'none',
      '&:hover, &:active, &:focus': {
        background: theme.palette.common.white,
        color: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  })
);
