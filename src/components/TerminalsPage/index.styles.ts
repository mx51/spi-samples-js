import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(5),
    },
    manageFleetSettingLink: {
      marginRight: theme.spacing(2),
      fontSize: '1rem',
    },
  })
);
export default useStyles;
