import React from 'react';
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from '@material-ui/core';
// styles
import useStyles from './index.styles';
// interfaces
import { PairingStatus, ITerminals } from './interfaces';

function TerminalList({ terminals }: ITerminals): React.ReactElement {
  const classes = useStyles();
  return (
    <div>
      <TableContainer component={Paper} className={classes.table} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>POS ID</TableCell>
              <TableCell>Pairing status</TableCell>
              <TableCell>EFTPOS address</TableCell>
              <TableCell>Serial number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {terminals.map((terminal) => (
              <TableRow key={terminal.posId}>
                <TableCell scope="row">{terminal.posId}</TableCell>
                <TableCell>
                  <Chip size="small" label={PairingStatus[terminal.pairingStatus]} className={classes.chipConnected} />
                </TableCell>
                <TableCell>{terminal.eftposAddress}</TableCell>
                <TableCell>{terminal.serialNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} align="center">
                Page 1
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}
export default TerminalList;
