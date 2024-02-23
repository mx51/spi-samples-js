import React from 'react';
import { Box, Button, Container, Typography } from '@material-ui/core';
import { Link as LinkRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PATH_PAIR } from '../../definitions/constants/routerConfigs';
import Layout from '../Layout';
import useStyles from './index.styles';
import TerminalList from './TerminalList';
import { terminalList } from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';

const Terminals: React.FC = () => {
  const classes = useStyles();
  const terminals = useSelector(terminalList);

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
        <TerminalList terminals={terminals} />
      </Container>
    </Layout>
  );
};

export default Terminals;
