import React, { useState } from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import { terminalInstance } from '../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import Layout from '../../Layout';
import NotFound from '../../NotFoundPage';
import AboutTerminal from './AboutTerminal';
import useStyles from './index.styles';
import PaTSettings from './PaTSettings';
import TabPanel from './TabPanel';

export default function TerminalDetails(): React.ReactElement {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [flow, setFlow] = useState(false); // By default, flow is closed

  const { pathname } = useLocation();
  const currentInstanceId = pathname?.split('/terminals/')[1];

  const currentTerminal = useAppSelector(terminalInstance(currentInstanceId));

  const handleDrawerToggle = () => {
    setFlow(!flow);
  };
  const classes = useStyles(flow);

  const handleTabChange = (event: React.ReactNode, newValue: number) => {
    setTabIndex(newValue);
  };

  const [receiptToggle, setReceiptToggle] = useState(false);

  return (
    <Layout>
      {currentTerminal ? (
        <div className={classes.root}>
          <Tabs
            aria-label="terminal details tabs"
            className={classes.tabs}
            id="terminalDetailsTabs"
            onChange={handleTabChange}
            value={tabIndex}
          >
            <Tab id="aboutTerminalTab" label="About this terminal" />
            <Tab id="payAtTableTab" label="Pay at Table" />
          </Tabs>

          <TabPanel
            flow={flow}
            index={0}
            setFlow={handleDrawerToggle}
            subtitle="View information about this terminal and the pairing configuration"
            title="About this terminal"
            value={tabIndex}
            receiptToggle={receiptToggle}
            terminal={currentTerminal as ITerminalProps}
          >
            <AboutTerminal
              receiptToggle={receiptToggle}
              setReceiptToggle={setReceiptToggle}
              terminal={currentTerminal}
            />
          </TabPanel>

          <TabPanel
            flow={flow}
            index={1}
            setFlow={handleDrawerToggle}
            subtitle="Configure your Pay at Table settings for this terminal"
            title="Pay at Table"
            value={tabIndex}
            terminal={currentTerminal as ITerminalProps}
          >
            <PaTSettings />
          </TabPanel>
        </div>
      ) : (
        <NotFound />
      )}
    </Layout>
  );
}
