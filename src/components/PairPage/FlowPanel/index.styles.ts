import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { drawerWidth } from '../../../definitions/constants/commonConfigs';

export default makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: `${drawerWidth}%`,
      flexShrink: 0,
    },
    drawerPaper: {
      width: `${drawerWidth}%`,
      borderLeft: 'none',
      background: 'transparent',
      display: 'flex',
      justifyContent: 'center',
    },
    flowBoxWrapper: {
      height: '100%',
      maxHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(10, 0, 4, 0),
    },
    flowBox: {
      background: theme.palette.common.white,
      width: '100%',
      height: '100%',
      overflowY: 'scroll', // handle flow status longer messages
      padding: theme.spacing(2),
      '& > h1': {
        paddingBottom: theme.spacing(2),
      },
    },
  })
);
