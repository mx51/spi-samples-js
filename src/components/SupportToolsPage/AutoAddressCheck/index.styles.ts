import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { FONT_COLOR } from '../../../definitions/constants/themeStylesConfigs';

export default makeStyles((theme: Theme) =>
  createStyles({
    toolContainer: {
      backgroundColor: theme.palette.common.white,
      borderRadius: theme.spacing(0.5),
      border: `1px solid ${theme.palette.secondary.main}`,
      marginTop: theme.spacing(1),
      padding: theme.spacing(3),
      width: '80%',
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
      fontSize: '1rem',
      color: FONT_COLOR,
      opacity: 0.6,
      marginLeft: 12,
      marginBottom: theme.spacing(2),
    },
    testMode: {
      marginBottom: theme.spacing(2),
    },
    submitBtn: {
      fontWeight: 300,
      marginBottom: theme.spacing(0.5),
      textTransform: 'none',
    },
    table: {
      '& .MuiTableCell-root': {
        borderBottom: 'none',
      },
    },
    tableKeyText: {
      fontSize: '1rem',
    },
    tableValueText: {
      color: FONT_COLOR,
      fontSize: '1rem',
    },
    tableValueLink: {
      color: theme.palette.info.main,
      fontSize: '1rem',
    },
    resultTitle: {
      marginBottom: theme.spacing(3),
    },
  })
);
