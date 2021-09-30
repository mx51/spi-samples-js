import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      fontWeight: 300,
    },
    detailRow: {
      margin: theme.spacing(3, 0, 0),
    },
    sectionSpacing: {
      width: '100%',
      marginTop: theme.spacing(3),
      paddingTop: theme.spacing(3),
      borderTop: `1px solid ${theme.palette.secondary.main}`,
    },
    fullWidth: {
      width: '100%',
    },
    actionButton: {
      display: 'block',
      color: theme.palette.info.main,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
    },
    statusBox: {
      padding: theme.spacing(1.5, 1),
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
