import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navbar: {
      width: '100%',
      '& .MuiSwitch-track': {
        backgroundColor: theme.palette.info.light,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    developerModeText: {
      paddingRight: theme.spacing(1),
    },
  })
);

export default useStyles;
