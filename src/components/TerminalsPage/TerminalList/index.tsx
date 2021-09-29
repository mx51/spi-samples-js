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
import { useAppDispatch } from '../../../redux/hooks';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import { handleUnPairClick } from '../../../utils/common/pair/pairStatusHelpers';
import useStyles from './index.styles';

function TerminalList({ terminals }: Any): React.ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();

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
            {terminals.map((terminal: ITerminalProps) => (
              <TableRow key={`terminal_${terminal.deviceAddress}`} id={`terminal_${terminal.serialNumber}`}>
                <TableCell scope="row" onClick={() => handleUnPairClick(dispatch, terminal.id)}>
                  {terminal.posId}
                </TableCell>
                <TableCell>
                  <Chip size="small" label={terminal.status} className={classes.chipConnected} />
                </TableCell>
                <TableCell>{terminal.deviceAddress}</TableCell>
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
