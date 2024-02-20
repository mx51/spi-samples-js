import React, { useState } from 'react';

import { Box, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import Layout from '../Layout';
import useStyles from './index.styles';
import { SettingsPanel } from './SettingsPanel/SettingsPanel';
import { PayAtTablePanel } from './PayAtTablePanel';

const panel = {
  terminalSetting: 0,
  payAtTable: 1,
};

const SettingsPage: React.FC = () => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(panel.terminalSetting);

  const handleTabChange = (event: React.ReactNode, newValue: number) => {
    setTabIndex(newValue);
  };

  const panelByIndex = {
    [panel.terminalSetting]: (
      <SettingsPanel
        index={tabIndex}
        subtitle="Configure the terminal settings and customise the EFTPOS receipts."
        title="Terminal Settings"
        value={tabIndex}
      />
    ),
    [panel.payAtTable]: <PayAtTablePanel />,
  };

  return (
    <Layout>
      <Grid container>
        <Grid item xs={12}>
          <Grid container justifyContent="center">
            <Grid item xs={7} className={classes.gridStyles}>
              <Box className={classes.root} display="flex" flexDirection="column">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box flex="1">
                    <Typography className={classes.payLabel}>Settings</Typography>
                  </Box>
                </Box>
              </Box>
              <Tabs
                aria-label="settings tabs"
                className={classes.tabs}
                id="settingsTabs"
                onChange={handleTabChange}
                value={tabIndex}
              >
                <Tab label="Terminal Settings" />
                {/* <Tab label="Pay At Table Settings" /> */}
              </Tabs>
              {panelByIndex[tabIndex]}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default SettingsPage;
