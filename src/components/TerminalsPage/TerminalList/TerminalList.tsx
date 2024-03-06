import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import { getTitleFromStatus } from '../../../utils/common/pair/pairStatusHelpers';
import TerminalActionMenu from '../../TerminalActionMenu';
import useStyles from './index.styles';
import { ITerminalList } from './interfaces';
import { PATH_TERMINALS } from '../../../definitions/constants/routerConfigs';

function TerminalList({ terminals }: ITerminalList): React.ReactElement {
  const classes = useStyles();
  const history = useHistory();

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
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {terminals.map((terminal: ITerminalProps) => (
            <TableRow id={`terminal_${terminal.serialNumber}`} key={`terminal_${terminal.deviceAddress}`}>
              <TableCell
                className={classes.link}
                onClick={() => goToTerminalDetails(`${PATH_TERMINALS}/${terminal.serialNumber}`)}
                scope="row"
              >
                {terminal.posId}
              </TableCell>
              <TableCell
                className={classes.link}
                onClick={() => goToTerminalDetails(`${PATH_TERMINALS}/${terminal.serialNumber}`)}
              >
                <Chip
                  size="small"
                  label={getTitleFromStatus(terminal.status, terminal.reconnecting)}
                  className={chipStyles(terminal.status)}
                />
              </TableCell>
              <TableCell
                className={classes.link}
                onClick={() => goToTerminalDetails(`${PATH_TERMINALS}/${terminal.serialNumber}`)}
              >
                {terminal.deviceAddress}
              </TableCell>
              <TableCell
                className={classes.link}
                onClick={() => goToTerminalDetails(`${PATH_TERMINALS}/${terminal.serialNumber}`)}
              >
                {terminal.serialNumber}
              </TableCell>
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
