import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { FONT_COLOR } from '../../definitions/constants/themeStylesConfigs';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(0),
    },
    tabs: {
      backgroundColor: theme.palette.background.default,
      borderBottom: `1px solid ${theme.palette.secondary.main}`,
      position: 'sticky',
      top: theme.spacing(6),
      zIndex: 1,
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
    label: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(0.5),
    },
    toolContainer: {
      backgroundColor: theme.palette.common.white,
      borderRadius: theme.spacing(0.5),
      border: `1px solid ${theme.palette.secondary.main}`,
      marginTop: theme.spacing(3),
      padding: theme.spacing(3),
      width: '100%',
    },
    h1: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    divider: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    infoText: {
      // fontSize: '1rem',
      color: FONT_COLOR,
      opacity: 0.8,
      marginLeft: theme.spacing(2),
      // marginBottom: theme.spacing(2),
    },
    testMode: {
      marginBottom: theme.spacing(2),
    },
    submitBtn: {
      fontWeight: 300,
      // marginBottom: theme.spacing(0.5),
      textTransform: 'none',
      // marginLeft: theme.spacing(2),
      margin: theme.spacing(2),
    },
  })
);
export default useStyles;
