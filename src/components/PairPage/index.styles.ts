import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { drawerWidth } from '../../definitions/constants/commonConfigs';
import { FlowPanelInterface } from './FlowPanel/interfaces';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(6),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: `${-drawerWidth}%`,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    },
    pairStatusContainer: {
      marginBottom: -theme.spacing(2), // keep same position with configuration form save settings button
    },
    pairFormContainer: {
      display: 'inherit',
    },
    [theme.breakpoints.between(960, 1025)]: {
      root: {
        '&>main': {
          padding: theme.spacing(6, 2),
        },
        '& form': {
          marginBottom: (flow: FlowPanelInterface) => (flow ? 0 : -theme.spacing(2)),
        },
      },
    },
    [theme.breakpoints.between(600, 959)]: {
      root: {
        '&>main': {
          padding: theme.spacing(6, 0),
        },
      },
      pairFormContainer: {
        display: (flow: FlowPanelInterface) => (flow ? 'none' : 'block'),
      },
      pairStatusContainer: {
        flexBasis: (flow: FlowPanelInterface) => (flow ? '100%' : '33.333333%'),
        maxWidth: (flow: FlowPanelInterface) => (flow ? '100%' : '33.333333%'),
      },
    },
    [theme.breakpoints.down(600)]: {
      root: {
        '&>main': {
          padding: theme.spacing(6, 0),
        },
        '& form': {
          marginBottom: theme.spacing(2),
        },
      },
      pairFormContainer: {
        display: (flow: FlowPanelInterface) => (flow ? 'none' : 'block'),
        flexBasis: '100%',
        maxWidth: '100%',
        '&>div': {
          paddingRight: 0,
        },
      },
      pairStatusContainer: {
        flexBasis: '100%',
        maxWidth: '100%',
      },
    },
  })
);
