import React, { useState } from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { useLocation } from 'react-router-dom';
import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
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
  const [tabIndex, setTabIndex] = useState(0);
  const [receiptToggle, setReceiptToggle] = useState(false);

  const { pathname } = useLocation();
  const currentInstanceId = pathname?.split('/terminals/')[1];

  const currentTerminal = useAppSelector(terminalInstance(currentInstanceId)) as ITerminalProps;

  const classes = useStyles();

  const handleTabChange = (event: React.ReactNode, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Layout>
      {currentTerminal?.status === SPI_PAIR_STATUS.PairedConnected ? (
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
            index={0}
            subtitle="View information about this terminal and the pairing configuration"
            title="About this terminal"
            value={tabIndex}
            receiptToggle={receiptToggle}
            terminal={currentTerminal}
          >
            <AboutTerminal
              receiptToggle={receiptToggle}
              setReceiptToggle={setReceiptToggle}
              terminal={currentTerminal as ITerminalProps}
            />
          </TabPanel>

          <TabPanel
            index={1}
            subtitle="Configure your Pay at Table settings for this terminal"
            title="Pay at Table"
            value={tabIndex}
            terminal={currentTerminal}
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
