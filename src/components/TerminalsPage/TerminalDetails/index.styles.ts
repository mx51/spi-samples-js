import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    tabs: {
      borderBottom: `1px solid ${theme.palette.secondary.main}`,
    },
  })
);

export default useStyles;
