import React from 'react';
import { Box, Button, Container, Typography } from '@material-ui/core';
import { Link as LinkRouter } from 'react-router-dom';
import { PATH_PAIR } from '../../definitions/constants/routerConfigs';
import { useAppSelector } from '../../redux/hooks';
import Layout from '../Layout';
import NoTerminalPage from '../NoTerminalPage';
import useStyles from './index.styles';
import TerminalList from './TerminalList';

const Terminals: React.FC = () => {
  const classes = useStyles();
  const terminals = useAppSelector((state) => state.terminals);
  const terminalList = Object.values(terminals);

  return (
    <Layout>
      <Container maxWidth="md" className={classes.root}>
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography variant="h6" component="h1">
              Terminals list
            </Typography>
          </Box>
          <Box>
            <Button variant="contained" color="primary" component={LinkRouter} to={PATH_PAIR}>
              + Pair terminal
            </Button>
          </Box>
        </Box>
        {terminalList.length <= 0 ? <NoTerminalPage /> : <TerminalList terminals={terminalList} />}
      </Container>
    </Layout>
  );
};

export default Terminals;
