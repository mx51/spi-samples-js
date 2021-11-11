import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { drawerWidth } from '../../../../definitions/constants/commonConfigs';
import { IFlowPanel } from '../../../FlowPanel/interfaces';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    panel: {
      flexGrow: 1,
      padding: theme.spacing(6),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: `${-drawerWidth}%`,
    },
    panelShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    },
    tabPanelContainer: {
      display: 'inherit',
      width: '100%',
    },
    [theme.breakpoints.between(960, 1025)]: {
      root: {
        '&>main': {
          padding: theme.spacing(6, 2),
        },
        '& form': {
          marginBottom: (showFlowPanel: IFlowPanel) => (showFlowPanel ? 0 : -theme.spacing(2)),
        },
      },
    },
    [theme.breakpoints.between(600, 959)]: {
      root: {
        '&>main': {
          padding: theme.spacing(6, 0),
        },
      },
      pairStatusContainer: {
        flexBasis: (showFlowPanel: IFlowPanel) => (showFlowPanel ? '100%' : '33.333333%'),
        maxWidth: (showFlowPanel: IFlowPanel) => (showFlowPanel ? '100%' : '33.333333%'),
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
      tabPanelContainer: {
        flexBasis: '100%',
        width: '100%',
        maxWidth: '100%',
        '&>div': {
          paddingRight: 0,
        },
      },
    },
    // tab showFlowPanel stylings
    text: {
      fontWeight: 300,
    },
    flowButton: {
      color: 'inherit',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
    },
    flowIcon: {
      cursor: 'pointer',
    },
    // receipt panel stylings
    detailsPanelContainer: {
      width: '100%',
      display: 'flex',
    },
    detailsPanel: {
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.secondary.main}`,
      borderRadius: theme.spacing(0.5),
      boxSizing: 'border-box',
      flexGrow: 1,
      marginRight: `${-drawerWidth}%`,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    detailsPanelShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    },
    receiptPanel: {
      flexShrink: 0,
      marginLeft: theme.spacing(4),
      width: `${drawerWidth}%`,
    },
    receiptPanelOpened: {
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.secondary.main}`,
      borderRadius: theme.spacing(0.5),
      boxSizing: 'border-box',
      flexShrink: 0,
      marginLeft: theme.spacing(4),
      width: `${drawerWidth}%`,
    },
    preContent: {
      whiteSpace: 'pre-wrap',
    },
  })
);

export default useStyles;
