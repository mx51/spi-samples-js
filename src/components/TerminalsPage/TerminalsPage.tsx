import React from 'react';
import { Box, Button, Container, Typography } from '@material-ui/core';
import { Link as LinkRouter } from 'react-router-dom';
import { PATH_PAIR } from '../../definitions/constants/routerConfigs';
import Layout from '../Layout';
import useStyles from './index.styles';
import TerminalList from './TerminalList';
import NoTerminalPage from '../NoTerminalPage';
import { useAppSelector } from '../../redux/hooks';

const Terminals: React.FC = () => {
  const classes = useStyles();
  const terminals = useAppSelector((state) => state.terminals);
  const terminalList = Object.entries(terminals)
    .filter((t) => t[0] !== '_persist' && t[0] !== '') // remove property set by redux-persist
    .map((t) => t[1]);

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
            {terminalList.length === 0 ? (
              ' '
            ) : (
              <Button variant="contained" color="primary" component={LinkRouter} to={PATH_PAIR}>
                + Pair new terminal
              </Button>
            )}
          </Box>
        </Box>
        {terminalList.length <= 0 ? <NoTerminalPage /> : <TerminalList terminals={terminalList} />}
      </Container>
    </Layout>
  );
};

export default Terminals;
