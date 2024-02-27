import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React from 'react';
import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import { getTitleFromStatus } from '../../../utils/common/pair/pairStatusHelpers';
import TerminalActionMenu from '../../TerminalActionMenu';
import useStyles from './index.styles';
import { ITerminalList } from './interfaces';

function TerminalList({ terminals }: ITerminalList): React.ReactElement {
  const classes = useStyles();

  const chipStyles = (status: string) => {
    switch (status) {
      case SPI_PAIR_STATUS.PairedConnected:
        return classes.chipConnected;
      case SPI_PAIR_STATUS.PairedConnecting:
        return classes.chipPending;
      case SPI_PAIR_STATUS.Unpaired:
        return classes.chipUnpaired;
      default:
        return classes.chipUnpaired;
    }
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
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {terminals.map((terminal: ITerminalProps) => (
            <TableRow
              // className={terminal.status !== SPI_PAIR_STATUS.PairedConnected ? classes.unclickable : classes.link}
              id={`terminal_${terminal.serialNumber}`}
              key={`terminal_${terminal.deviceAddress}`}
            >
              <TableCell scope="row">{terminal.posId}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={getTitleFromStatus(terminal.status, terminal.reconnecting)}
                  className={chipStyles(terminal.status)}
                />
              </TableCell>
              <TableCell>{terminal.deviceAddress}</TableCell>
              <TableCell>{terminal.serialNumber}</TableCell>
              <TableCell>
                <TerminalActionMenu terminal={terminal} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TerminalList;
