import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      paddingBottom: theme.spacing(2),
      background: theme.palette.background.default,
    },
    flowBox: {
      background: theme.palette.common.white,
    },
    flowToggle: {
      zIndex: 2,
    },
    flowButton: {
      color: 'inherit',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
    },
    flowIcon: {
      cursor: 'pointer',
    },
    statusPanel: {
      border: `1px solid ${theme.palette.secondary.main}`,
      borderBottom: 'none',
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
    statusTitle: {
      fontSize: '1.125rem',
      fontWeight: 500,
      wordBreak: 'break-word',
    },
    pairingCode: {
      fontSize: '1.125rem',
      fontWeight: 500,
      wordBreak: 'break-word',
      letterSpacing: '0.02rem',
      paddingTop: '1rem',
    },
    statusText: {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: theme.palette.text.secondary,
      wordBreak: 'break-word',
    },
    statusInfoBox: {
      marginBottom: theme.spacing(1.5),
      paddingLeft: theme.spacing(1),
      '& h6': {
        fontSize: '1rem',
        fontWeight: 500,
        paddingTop: theme.spacing(1.5),
      },
      '& span': {
        fontSize: '0.875rem',
        fontWeight: 400,
        color: theme.palette.text.secondary,
      },
    },
    statusButtonBox: {
      padding: theme.spacing(1.5),
      border: `1px solid ${theme.palette.secondary.main}`,
      borderTop: 'none',
      borderBottomLeftRadius: theme.spacing(0.5),
      borderBottomRightRadius: theme.spacing(0.5),
    },
    unpairButton: {
      color: 'inherit',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 300,
      marginBottom: theme.spacing(0.5),
    },
    pairBtn: {
      fontWeight: 300,
      marginBottom: theme.spacing(0.5),
      textTransform: 'none',
    },
    cancelPairingBtn: {
      background: theme.palette.common.white,
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      fontWeight: 300,
      marginBottom: theme.spacing(0.5),
      textTransform: 'none',
      '&:hover, &:active, &:focus': {
        background: theme.palette.common.white,
        color: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
    failedIcon: {
      color: theme.palette.error.main,
    },
    reconnectIcon: {
      color: theme.palette.warning.main,
    },
    successIcon: {
      color: theme.palette.success.main,
    },
  })
);

export default useStyles;
