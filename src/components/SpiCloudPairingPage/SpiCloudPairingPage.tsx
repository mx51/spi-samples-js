import React from 'react';

import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { Link as LinkRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../Layout';
import useStyles from './index.styles';
import { PATH_SPI_CLOUD_PAIRING_NEW } from '../../definitions/constants/routerConfigs';
import { pairingsList } from '../../redux/reducers/PairingSlice/pairingSelectors';
import { IPairingProps } from '../../redux/reducers/PairingSlice/interfaces';

const SpiCloudPairingPage: React.FC = () => {
  const classes = useStyles();
  const pairings = useSelector(pairingsList);
  return (
    <Layout>
      <Container maxWidth="md" className={classes.root}>
        <Box display="flex" mb={3}>
          <Box flexGrow={1}>
            <Typography variant="h6" component="h1">
              SPI Cloud Pairing
            </Typography>
          </Box>
          <Box>
            <Button variant="contained" color="primary" component={LinkRouter} to={PATH_SPI_CLOUD_PAIRING_NEW}>
              + Pair SPI Cloud
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pairings.map((pairing: IPairingProps) => (
                <TableRow key={`pairing_${pairing.pairing_id}`}>
                  <TableCell scope="row">{pairing.pairing_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Layout>
  );
};

export default SpiCloudPairingPage;
