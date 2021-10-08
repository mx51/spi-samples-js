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
import { useHistory } from 'react-router-dom';
import { PATH_TERMINALS } from '../../../definitions/constants/routerConfigs';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import useStyles from './index.styles';

function TerminalList({ terminals }: Any): React.ReactElement {
  const classes = useStyles();
  const history = useHistory();

  const goToTerminalDetails = (path: string) => {
    history.push(path);
  };

  return (
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
            <TableRow
              className={classes.link}
              id={`terminal_${terminal.serialNumber}`}
              key={`terminal_${terminal.deviceAddress}`}
              onClick={() =>
                goToTerminalDetails(
                  terminal.serialNumber ? `${PATH_TERMINALS}/${terminal.serialNumber}` : PATH_TERMINALS
                )
              }
            >
              <TableCell scope="row">{terminal.posId}</TableCell>
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
  );
}

export default TerminalList;
