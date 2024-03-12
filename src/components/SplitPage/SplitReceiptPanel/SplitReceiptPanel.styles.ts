import { alpha, makeStyles, Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import { FONT_COLOR } from '../../../definitions/constants/themeStylesConfigs';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      maxWidth: '80%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    summary: {
      height: 'calc(100vh - 48px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    successIcon: {
      color: theme.palette.success.main,
      margin: theme.spacing(1),
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    failedIcon: {
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
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '1rem',
      letterSpacing: '0.02rem',
      fontSize: '3rem',
      fontWeight: 'normal',
    },
    splitNumberRow: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.5rem',
      color: 'black',
    },
    outstandingAmountRow: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.5rem',
      color: 'black',
    },
    orderSummery: {
      margin: theme.spacing(2),
      textAlign: 'left',
      color: FONT_COLOR,
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
    receiptBoxWrapper: {
      height: '100%',
      maxHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(6, 0),
      '& > div': {
        background: theme.palette.common.white,
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: theme.spacing(0.5),
        width: '100%',
        height: '100%',
        overflowY: 'scroll', // handle flow status longer messages
        padding: theme.spacing(2),
        '& > h1': {
          paddingBottom: theme.spacing(2),
        },
      },
    },
  })
);
