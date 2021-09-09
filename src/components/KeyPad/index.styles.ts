import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: `calc(100vh - 48px)`,
      position: 'sticky',
      top: theme.spacing(6),
    },
    heading: {
      padding: theme.spacing(2),
    },
    grid: {
      flexGrow: 1,
    },
    keypadDisplay: {
      padding: theme.spacing(2),
    },
    keypadDisplayLabel: {
      textAlign: 'center',
      fontSize: '1rem',
      color: theme.palette.text.secondary,
    },
    keypadDisplayAmount: {
      textAlign: 'right',
      fontSize: '4.5rem',
      fontWeight: 'normal',
    },
    keypadBtn: {
      height: '100%',
      borderRadius: 0,
      fontSize: '2rem',
      borderTopColor: 'transparent',
      borderLeftColor: 'transparent',
      borderRightColor: theme.palette.divider,
      borderBottomColor: theme.palette.divider,
    },
    keypadBtnLabel: {
      fontSize: '3rem',
      fontWeight: 400,
      color: theme.palette.text.secondary,
    },
    okBtn: {
      padding: theme.spacing(2),
      borderRadius: 0,
      backgroundColor: theme.palette.error.dark,
      '&:hover, &:active, &:focus': {
        background: theme.palette.error.main,
        color: theme.palette.common.white,
      },
    },
    okBtnLabel: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: '1.5rem',
    },
  })
);
