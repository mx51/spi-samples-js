import React, { useMemo, useState } from 'react';

import { Box, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import Layout from '../Layout';
import useStyles from './index.styles';
import { SettingsPanel } from './SettingsPanel/SettingsPanel';
import { PayAtTablePanel } from './PayAtTablePanel';
import { IntegrationsSettingsPanel } from './IntegrationSettingsPanel';

const panel = {
  terminalSetting: 0,
  payAtTable: 1,
  integrationSettings: 2,
};

const SettingsPage: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(panel.terminalSetting);

  const tabs = [
    { label: 'Terminal Settings', route: '/settings' },
    { label: 'Pay At Table', route: '/settings/pay-at-table' },
    { label: 'Integration Settings', route: '/settings/integration-settings' },
  ];

  useMemo(() => {
    let activeTabIndex;
    switch (location.pathname) {
      case '/settings':
        activeTabIndex = panel.terminalSetting;
        break;
      case '/settings/integration-settings':
        activeTabIndex = panel.integrationSettings;
        break;
      case '/settings/pay-at-table':
        activeTabIndex = panel.payAtTable;
        break;
      default:
        activeTabIndex = panel.terminalSetting;
    }
    setTabIndex(activeTabIndex);
  }, [location.pathname]);

  const handleTabChange = (event: React.ReactNode, newValue: number) => {
    history.push(tabs[newValue].route);
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
                <Tab label="Pay At Table Settings" />
                <Tab label="Integration Settings" />
              </Tabs>

              <Switch>
                <Route path="/settings" exact>
                  <SettingsPanel
                    index={tabIndex}
                    subtitle="Configure the terminal settings and customise the EFTPOS receipts."
                    title="Terminal Settings"
                    value={tabIndex}
                  />
                </Route>
                <Route path="/settings/pay-at-table">
                  <PayAtTablePanel />
                </Route>
                <Route path="/settings/integration-settings">
                  <IntegrationsSettingsPanel />
                </Route>
                <Redirect from="*" to="/settings" />
              </Switch>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default SettingsPage;
