import React, { useState } from 'react';
import { Box, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import Layout from '../Layout';
import useStyles from './index.styles';
import { SettingsPanel } from './SettingsPanel/SettingsPanel';

const SettingsPage: React.FC = () => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.ReactNode, newValue: number) => {
    setTabIndex(newValue);
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
                <Tab id="terminalSettingsTab" label="Terminal Settings" />
                {/* <Tab id="posSettingsTab" label="POS Settings" /> */}
              </Tabs>
              {tabIndex === 0 && (
                <SettingsPanel
                  index={0}
                  subtitle="Configure the terminal settings and customise the EFTPOS receipts."
                  title="Terminal Settings"
                  value={tabIndex}
                />
              )}
              {tabIndex === 1 && (
                <SettingsPanel index={1} subtitle="Configure the POS settings." title="POS Settings" value={tabIndex} />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default SettingsPage;
