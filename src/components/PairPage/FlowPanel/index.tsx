import React from 'react';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import useStyles from './index.styles';
import { FlowPanelInterface } from './interfaces';

export default function FlowPanel({ flow }: FlowPanelInterface): React.ReactElement {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="right"
      open={flow}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Box className={classes.flowBoxWrapper}>
        <Box className={classes.flowBox}>
          <Typography variant="h6" component="h1">
            Flow
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
