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
      margin: '3rem',
    },
    payLable: {
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
    orderTotalbtn: {
      '&:hover': {
        background: 'none',
      },
    },
    radioGroup: {
      flexGrow: 1,
      overflowY: 'auto',
    },
    orderTotalInputField: {
      marginRight: '2rem',
      padding: '2rem',
      letterSpacing: '0.02rem',
      fontSize: '3rem',
      fontWeight: 'normal',
    },
    label: {
      marginTop: '2rem',
      marginBottom: '.5rem',
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
      margin: '1rem',
    },
    radiobtn: {
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
