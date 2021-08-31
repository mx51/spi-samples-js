import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

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
    },
    payNowBtnLabel: {
      fontWeight: 500,
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
  })
);
