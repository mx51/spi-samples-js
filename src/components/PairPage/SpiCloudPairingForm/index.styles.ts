import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    backLink: {
      marginBottom: '16px',
    },
    backLinkText: {
      fontSize: '1rem',
      marginRight: '10px',
    },
    pairingCode: {
      fontSize: '3rem',
      fontWeight: 500,
      wordBreak: 'break-word',
      letterSpacing: '0.02rem',
      paddingTop: '1rem',
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
    statusPanel: {
      background: theme.palette.common.white,
      height: '100%',
      border: `1px solid ${theme.palette.secondary.main}`,
      borderTopLeftRadius: theme.spacing(0.5),
      borderTopRightRadius: theme.spacing(0.5),
      display: 'flex',
      width: '100%',
      flexGrow: 1,
      padding: theme.spacing(1.5),
    },
    statusBox: {
      padding: theme.spacing(1.5, 1),
      background: theme.palette.background.default,
      borderRadius: theme.spacing(0.625),
      marginBottom: theme.spacing(1.5),
      '&>.MuiTypography-root': {
        display: 'flex',
        alignItems: 'center',
      },
    },
    reconnectIcon: {
      color: theme.palette.warning.main,
    },
  })
);
