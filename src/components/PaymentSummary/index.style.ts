import { alpha, createStyles, makeStyles, Theme } from '@material-ui/core';
import { FONT_COLOR } from '../../definitions/constants/themeStylesConfigs';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      height: `calc(100vh - 60px)`,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    alignTop: {
      alignItems: 'unset',
      padding: theme.spacing(6, 2),
    },
    roots: {
      display: 'flex',
      flexDirection: 'column',
    },
    connectedIcon: {
      color: theme.palette.success.main,
      margin: theme.spacing(1),
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    unpairedIcon: {
      color: theme.palette.error.main,
      margin: theme.spacing(1),
      marginLeft: 'auto',
      marginRight: 'auto',
    },

    heading: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.5rem',
    },
    subheading: {
      fontSize: '.8rem',
      fontWeight: 400,
      lineHeight: '1.5rem',
      color: FONT_COLOR,
      marginBottom: theme.spacing(3),
    },
    paper: {
      border: 'none',
      alignItems: 'center',
      textAlign: 'center',
      padding: '1rem',
      letterSpacing: '0.02rem',
      fontSize: '3rem',
      fontWeight: 'normal',
    },
    orderSummery: {
      margin: theme.spacing(2),
      textAlign: 'left',
      paddingLeft: '.5rem',
      color: FONT_COLOR,
    },
    orderTotalInputField: {
      marginRight: theme.spacing(2),
      padding: '2rem',
      letterSpacing: '0.02rem',
      fontSize: '3rem',
      fontWeight: 'normal',
    },

    actionBtn: {
      padding: theme.spacing(2),
      borderRadius: 0,
      backgroundColor: theme.palette.error.dark,
      '&:hover, &:active, &:focus': {
        background: alpha(theme.palette.error.dark, 0.75),
        color: theme.palette.common.white,
      },
      width: '100%',
    },
  })
);
export default useStyles;
