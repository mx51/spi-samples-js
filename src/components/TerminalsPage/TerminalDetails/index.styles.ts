import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    tabs: {
      backgroundColor: theme.palette.background.default,
      borderBottom: `1px solid ${theme.palette.secondary.main}`,
      position: 'sticky',
      top: theme.spacing(6),
      zIndex: 1,
    },
  })
);

export default useStyles;
