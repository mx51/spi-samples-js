import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import React from 'react';
import useStyles from './index.styles';
import { SpiCloudPairing } from '../../../redux/reducers/PairingSlice/interfaces';

function SpiCloudTerminalList({ pairings }: { pairings: SpiCloudPairing[] }): React.ReactElement {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h3" className={classes.tableHeading}>
        SPI Cloud
      </Typography>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pairing ID</TableCell>
              <TableCell>TID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pairings.map((pairing: SpiCloudPairing) => (
              <TableRow key={`pairing_${pairing.pairingId}`}>
                <TableCell scope="row">
                  <span className={classes.pairingIcon} style={{ backgroundColor: pairing.hexCode }} />
                  {pairing.pairingId}
                </TableCell>
                <TableCell scope="row">{pairing.tid}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
export default SpiCloudTerminalList;
