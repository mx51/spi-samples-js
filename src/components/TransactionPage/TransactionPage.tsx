import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  TableContainer,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import { SuccessState } from '@mx51/spi-client-js';
import dayjs from 'dayjs';
import Layout from '../Layout';
import { useTransactionPageStyle } from './TransactionPage.style';
import { ReactComponent as FailedIcon } from '../../images/FailedIcon.svg';
import { ReactComponent as SuccessIcon } from '../../images/SuccessIcon.svg';
import { ReactComponent as UnknownIcon } from '../../images/WarningIcon.svg';
import { TxLogItem, TxLogService } from '../../services/txLogService';
import currencyFormat from '../../utils/common/intl/currencyFormatter';

export const TransactionPage: React.FC = () => {
  const [txLogItems, setTxLogItems] = useState<TxLogItem[]>([]);
  const classes = useTransactionPageStyle();

  useEffect(() => {
    setTxLogItems(TxLogService.load().filter((tx) => dayjs(tx.completedTime).date() >= dayjs().date()));
  }, []);

  const iconByStatus = {
    [SuccessState.Success]: <SuccessIcon className={classes.successIcon} />,
    [SuccessState.Failed]: <FailedIcon className={classes.failedIcon} />,
    [SuccessState.Unknown]: <UnknownIcon className={classes.failedIcon} />,
  };

  return (
    <Layout>
      <Container className={classes.container} maxWidth="md">
        <Typography variant="h6" component="h1">
          Transactions list
        </Typography>
        <div className={classes.spacing} />
        {txLogItems.length === 0 ? (
          <Paper className={classes.noTxContainer}>No transactions found</Paper>
        ) : (
          <TableContainer className={classes.tableContainer} component={Paper}>
            <Table stickyHeader aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Time</TableCell>
                  <TableCell>Transaction</TableCell>
                  <TableCell>POS ID</TableCell>
                  <TableCell>TID</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {txLogItems.map(({ posRefId, successState, completedTime, posId, type, tid, amount, override }) => (
                  <TableRow key={posRefId}>
                    <TableCell>
                      <div className={classes.iconContainer}>
                        {iconByStatus[override ? SuccessState.Unknown : successState]}
                      </div>
                    </TableCell>
                    <TableCell>{dayjs(completedTime).format('hh:mm A')}</TableCell>
                    <TableCell>{type}</TableCell>
                    <TableCell>{posId}</TableCell>
                    <TableCell>{tid}</TableCell>
                    <TableCell>{currencyFormat(amount / 100)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Layout>
  );
};
