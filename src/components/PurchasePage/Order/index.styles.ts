import { makeStyles, Theme, createStyles, alpha } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: `calc(100vh - 48px)`,
      position: 'sticky',
      top: theme.spacing(6),
      zIndex: 1020,
    },
    heading: {
      padding: theme.spacing(2),
    },
    clear: {
      color: theme.palette.info.main,
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontWeight: 'lighter',
    },
    keypadDrawerPaper: {
      width: '33.34%',
      backgroundColor: 'transparent',
      border: 0,
    },
    total: {
      color: theme.palette.primary.main,

      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: '1.5rem',
      letterSpacing: '0.03rem',
    },

    totalPrice: {
      fontSize: '2rem',
      color: theme.palette.primary.main,
    },
    payNowBtn: {
      padding: theme.spacing(2),
      borderRadius: 0,
      backgroundColor: theme.palette.error.dark,
      '&:hover, &:active, &:focus': {
        background: alpha(theme.palette.error.dark, 0.75),
        color: theme.palette.common.white,
      },
    },
    amendBtn: {
      padding: theme.spacing(2),
      borderRadius: 0,
      backgroundColor: theme.palette.text.hint,
      '&:hover, &:active, &:focus': {
        background: alpha(theme.palette.text.hint, 0.75),
        color: theme.palette.common.white,
      },
      fontWeight: 100,
    },
    actionBtnLabel: {
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: '1.5rem',
    },
    items: {
      color: theme.palette.primary.main,
      fontSize: '1rem',
      fontWeight: 'normal',
      lineHeight: '1.5rem',
    },
    amount: {
      fontSize: '1.25rem',
    },
    orderList: {
      flexGrow: 1,
      overflowY: 'auto',
    },
    checkbox: {
      paddingLeft: theme.spacing(3),
      color: theme.palette.primary.main,
    },
    checkboxLabel: {
      fontSize: '0.875rem',
    },
  })
);
