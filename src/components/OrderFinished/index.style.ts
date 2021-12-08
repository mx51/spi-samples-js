import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
export default useStyles;
