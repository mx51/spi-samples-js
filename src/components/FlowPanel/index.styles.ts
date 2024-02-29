import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { drawerWidth } from '../../definitions/constants/commonConfigs';

export default makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: `${drawerWidth}%`,
      flexShrink: 0,
    },
    drawerPaper: {
      width: `${drawerWidth}%`,
      border: 'none',
      background: 'transparent',
      display: 'flex',
      justifyContent: 'center',
    },
    flowBoxWrapper: {
      height: '100%',
      maxHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(12, 0, 6),
    },
    flowBox: {
      background: theme.palette.common.white,
      border: `1px solid ${theme.palette.secondary.main}`,
      borderRight: 'none',
      borderTopLeftRadius: theme.spacing(0.5),
      borderBottomLeftRadius: theme.spacing(0.5),
      width: '100%',
      height: '100%',
      overflowY: 'scroll', // handle flow status longer messages
      padding: theme.spacing(2),
      '& > h1': {
        paddingBottom: theme.spacing(2),
      },
    },
    flowContent: {
      marginTop: -theme.spacing(2),
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
    },
  })
);
