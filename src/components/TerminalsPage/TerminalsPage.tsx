import React, { useState } from 'react';
import { Box, Button, Container, Tab, Tabs, Typography } from '@material-ui/core';
import { Link as LinkRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PATH_PAIR } from '../../definitions/constants/routerConfigs';
import Layout from '../Layout';
import { terminalList } from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';

import useStyles from './index.styles';
import TerminalList from './TerminalList';
import { pairingsList } from '../../redux/reducers/PairingSlice/pairingSelectors';
import SpiCloudTerminalList from './SpiCloudTerminalList/SpiCloudTerminalList';

const Terminals: React.FC = () => {
  const classes = useStyles();
  const terminals = useSelector(terminalList);
  const spiCloudTerminals = useSelector(pairingsList);
  const [tabIndex, setActiveTab] = useState(0);

  const handleTabChange = (event: React.ReactNode, newValue: number) => {
    setActiveTab(newValue);
  };

  const getTabLabel = (label: string, count: number) => (
    <div className={classes.counterWrap}>
      <div className={classes.counterLabel}>{label}</div>
      <div className={classes.counter}>
        <span className={classes.counterCount}>{count}</span>
      </div>
    </div>
  );

  return (
    <Layout>
      <Container maxWidth="md" className={classes.root}>
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography variant="h6" component="h1">
              Terminals
            </Typography>
          </Box>
          <Box>
            <Button variant="contained" color="primary" component={LinkRouter} to={PATH_PAIR}>
              + Pair new terminal
            </Button>
          </Box>
        </Box>
        <Tabs
          aria-label="pairing tabs"
          className={classes.tabs}
          id="settingsTabs"
          onChange={handleTabChange}
          value={tabIndex}
        >
          <Tab label={getTabLabel('Simple Payments Integration', terminals.length)} />
          <Tab label={getTabLabel('SPI Cloud', spiCloudTerminals.length)} />
        </Tabs>
        {tabIndex === 0 && <TerminalList terminals={terminals} />}
        {tabIndex === 1 && <SpiCloudTerminalList pairings={spiCloudTerminals} />}
      </Container>
    </Layout>
  );
};

export default Terminals;
