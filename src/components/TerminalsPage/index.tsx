import React from 'react';

import { Box, Button, Container, Typography, Link } from '@material-ui/core';
import { Link as LinkRouter } from 'react-router-dom';

// constants
import { PATH_FLEET_SETTINGS, PATH_PAIR } from '../../definitions/constants/routerConfigs';
// interfaces
import { PairingStatus, Terminal } from './TerminalList/interfaces';
// components
import Layout from '../Layout';
import NoTerminalPage from '../NoTerminalPage';
// styles
import useStyles from './index.styles';
import TerminalList from './TerminalList';

const Terminals: React.FC = () => {
  const classes = useStyles();

  // Note: This will be replaced by redux
  const terminals: Array<Terminal> = [
    {
      posId: 'test1',
      pairingStatus: PairingStatus.Connected,
      eftposAddress: '10.20.30.40',
      serialNumber: '123-345-567',
    },
    {
      posId: 'test2',
      pairingStatus: PairingStatus.Connecting,
      eftposAddress: '10.20.30.40',
      serialNumber: '123-345-567',
    },
  ];
  // note: once we set up redex we can show and hide noterminal and TerminaList Component
  return (
    <Layout>
      <Container maxWidth="md" className={classes.root}>
        <Box display="flex">
          <Box flexGrow={1} justifyContent="flex-end">
            <Typography variant="h6" component="h1">
              Terminals list
            </Typography>
          </Box>
          <Box>
            <Link href={PATH_FLEET_SETTINGS} className={classes.manageFleetSettingLink}>
              Manage fleet settings
            </Link>
            <Button variant="contained" color="primary" component={LinkRouter} to={PATH_PAIR}>
              + Pair terminal
            </Button>
          </Box>
        </Box>
        <NoTerminalPage />
        <TerminalList terminals={terminals} />
      </Container>
    </Layout>
  );
};

export default Terminals;
