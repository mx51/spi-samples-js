import { alpha, createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: `calc(100vh - 120px)`,
      position: 'sticky',
      top: theme.spacing(6),
      zIndex: 1020,
    },
    gridStyles: {
      margin: theme.spacing(3),
    },
    payLabel: {
      fontSize: '3rem',
      fontWeight: 300,
      lineHeight: '4.08rem',
      paddingRight: '3rem',
    },
    paper: {
      border: 'none',
      paddingRight: '1rem',
      alignItems: 'center',
      textAlign: 'center',
    },
    orderTotalBtn: {
      '&:hover': {
        background: 'none',
      },
    },
    radioGroup: {
      flexGrow: 1,
      overflowY: 'auto',
    },
    orderTotalInputField: {
      marginRight: theme.spacing(2),
      padding: '2rem',
      letterSpacing: '0.02rem',
      fontSize: '3rem',
      fontWeight: 'normal',
    },
    label: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(0.5),
    },
    paymentTypeBtnLabel: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: '1.5rem',
    },

    paymentTypeBtn: {
      padding: theme.spacing(2),
      backgroundColor: theme.palette.error.dark,
      '&:hover, &:active, &:focus': {
        background: alpha(theme.palette.error.dark, 0.75),
        color: theme.palette.common.white,
      },

      width: '100%',
      margin: theme.spacing(1),
    },
    radioBtn: {
      color: theme.palette.primary.main,
    },
    keypadDrawerPaper: {
      width: '33.34%',
      backgroundColor: 'transparent',
      border: 0,
    },
  })
);
export default useStyles;
