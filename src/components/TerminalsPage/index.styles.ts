import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
    },
    manageFleetSettingLink: {
      marginRight: theme.spacing(2),
      fontSize: '1rem',
    },
    manageFleetSetting: {
      padding: theme.spacing(1),
    },
  })
);
export default useStyles;
