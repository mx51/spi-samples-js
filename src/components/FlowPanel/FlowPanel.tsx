import React from 'react';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import { useAppSelector } from '../../redux/hooks';
import { selectedShowFlowPanel } from '../../redux/reducers/CommonSlice/commonSliceSelectors';
import useStyles from './index.styles';

export default function FlowPanel({ children }: { children: React.ReactNode }): React.ReactElement {
  const classes = useStyles();
  const showFlowPanel = useAppSelector(selectedShowFlowPanel);

  return (
    <Drawer
      anchor="right"
      classes={{
        paper: classes.drawerPaper,
      }}
      className={classes.drawer}
      data-test-id="flowPanel"
      open={showFlowPanel}
      variant="persistent"
    >
      <Box className={classes.flowBoxWrapper}>
        <Box className={classes.flowBox}>
          <Typography variant="h6" component="h1">
            Flow
          </Typography>
          {children}
        </Box>
      </Box>
    </Drawer>
  );
}
