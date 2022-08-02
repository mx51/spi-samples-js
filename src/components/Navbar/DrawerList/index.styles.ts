import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TEXT_LIGHT_COLOR } from '../../../definitions/constants/themeStylesConfigs';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: 256,
    },
    title: {
      color: TEXT_LIGHT_COLOR,
      fontSize: '0.875rem',
      paddingTop: theme.spacing(2),
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 0,
    },
    menuLinks: {
      padding: theme.spacing(2),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 100,
      justifyContent: 'space-between',
    },
  })
);

export default useStyles;
