import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    tabs: {
      backgroundColor: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.secondary.main}`,
      position: 'sticky',
      top: theme.spacing(6),
      zIndex: 1,
    },
    submitBtn: {
      fontWeight: 300,
      marginBottom: theme.spacing(3),
      textTransform: 'none',
    },
    h2: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    label: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(0.5),
    },
    radioGroup: {
      flexGrow: 1,
      overflowY: 'auto',
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(2),
    },
    radioBtn: {
      color: theme.palette.primary.main,
    },
    receiptBoxWrapper: {
      height: '100%',
      maxHeight: '100%',
      display: 'flex',
      alignItems: 'center',
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
