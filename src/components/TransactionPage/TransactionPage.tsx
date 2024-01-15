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
import { useHistory } from 'react-router-dom';
import Layout from '../Layout';
import { useTransactionPageStyle } from './TransactionPage.style';
import { TxLogItem, TxLogService } from '../../services/txLogService';
import { PATH_TRANSACTIONS } from '../../definitions/constants/routerConfigs';
import { useGetTxDetails } from './useGetTxDetails';
import currencyFormat from '../../utils/common/intl/currencyFormatter';

export const TransactionPage: React.FC = () => {
  const [txLogItems, setTxLogItems] = useState<TxLogItem[]>([]);
  const classes = useTransactionPageStyle();
  const history = useHistory();
  const { getTransactionType, getIconByStatus } = useGetTxDetails();

  const goToTransactionDetails = (path: string) => {
    history.push(path);
  };

  useEffect(() => {
    setTxLogItems(
      TxLogService.load()
        .filter((tx) => tx.posRefId && dayjs(tx.completedTime).date() >= dayjs().date())
        .sort((tx1, tx2) => tx2.completedTime - tx1.completedTime)
    );
  }, []);

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
                  <TableCell>Source</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {txLogItems.map(
                  ({
                    posRefId,
                    successState,
                    completedTime,
                    posId,
                    type,
                    tid,
                    override,
                    transactionType,
                    total,
                    source,
                  }) => (
                    <TableRow
                      hover
                      key={posRefId}
                      onClick={() => goToTransactionDetails(`${PATH_TRANSACTIONS}/${posRefId}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <div className={classes.iconContainer}>
                          {getIconByStatus(override ? SuccessState.Unknown : successState)}
                        </div>
                      </TableCell>
                      <TableCell>{dayjs(completedTime).format('hh:mm A')}</TableCell>
                      <TableCell>{getTransactionType(type, transactionType)}</TableCell>
                      <TableCell>{posId}</TableCell>
                      <TableCell>{tid}</TableCell>
                      <TableCell>{currencyFormat(total / 100)}</TableCell>
                      <TableCell>{source}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Layout>
  );
};
