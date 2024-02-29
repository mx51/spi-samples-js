import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useTransactionDetailPageStyle = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(7),
      paddingBottom: theme.spacing(7),
      width: '100%',
    },
    gridContainer: {
      display: 'flex',
      paddingTop: theme.spacing(7),
      paddingBottom: theme.spacing(7),
      width: '100%',
    },
    gridItem: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '50%',
    },
    iconContainer: {
      display: 'flex',
    },
    backLink: {
      color: theme.palette.primary.main,
      cursor: 'pointer',
    },
    root: {
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
    roots: {
      display: 'flex',
      flexDirection: 'column',
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
      marginBottom: theme.spacing(3),
    },
    body: {
      marginTop: theme.spacing(2),
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
    receiptBoxWrapper: {
      height: '100%',
      width: '100%',
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
    divider: {
      margin: theme.spacing(2, 0),
    },
  })
);
