import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sectionSpacing: {
      marginTop: theme.spacing(3),
      paddingTop: theme.spacing(3),
    },
    switchBox: {
      padding: theme.spacing(1.5, 1),
      marginBottom: theme.spacing(1.5),
      '& h5': {
        fontSize: '1.125rem',
        fontWeight: 500,
        wordBreak: 'break-word',
      },
      '& span': {
        fontSize: '0.875rem',
        fontWeight: 400,
        color: theme.palette.text.secondary,
        wordBreak: 'break-word',
      },
      '&>.MuiTypography-root': {
        display: 'flex',
        alignItems: 'center',
      },
    },
  })
);

export default useStyles;
