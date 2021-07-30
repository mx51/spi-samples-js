import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainTitle: {
      paddingBottom: theme.spacing(1.5),
      background: theme.palette.background.default,
    },
    flowBox: {
      height: '100%',
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
      '& h5': {
        fontSize: '1.125rem',
        fontWeight: 500,
        wordBreak: 'break-word',
      },
      '& span': {
        fontSize: '0.875rem',
        fontWeight: 400,
        color: theme.palette.text.secondary,
        wordBreak: 'break-word',
      },
      '&>.MuiTypography-root': {
        display: 'flex',
        alignItems: 'center',
      },
    },
    statusInfoBox: {
      marginBottom: theme.spacing(1.5),
      paddingLeft: theme.spacing(1),
      '& h6': {
        fontSize: '1rem',
        fontWeight: 500,
      },
      '& span': {
        fontSize: '0.875rem',
        fontWeight: 400,
        color: theme.palette.text.secondary,
      },
    },
    statusButtonBox: {
      padding: theme.spacing(1.5),
    },
    unpairButton: {
      color: 'inherit',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      marginBottom: theme.spacing(0.5),
    },
    pairBtn: {
      marginBottom: theme.spacing(0.5),
      textTransform: 'none',
    },
    cancelPairingBtn: {
      background: theme.palette.common.white,
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      textTransform: 'none',
      '&:hover, &:active, &:focus': {
        background: theme.palette.common.white,
        color: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
      marginBottom: theme.spacing(0.5),
    },
    unpairedIcon: {
      color: theme.palette.error.main,
    },
    reconnectIcon: {
      color: theme.palette.warning.main,
    },
    connectedIcon: {
      color: theme.palette.success.main,
    },
  })
);

export default useStyles;
