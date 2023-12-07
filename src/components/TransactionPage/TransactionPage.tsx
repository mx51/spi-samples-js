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
import { useGetTxDetails } from '../../hooks/useGetTxDetails';
import { calculateCashoutOnlyTotalAmount, calculateTotalAmount } from '../../utils/common/helpers';

export const TransactionPage: React.FC = () => {
  const [txLogItems, setTxLogItems] = useState<TxLogItem[]>([]);
  const classes = useTransactionPageStyle();
  const history = useHistory();
  const { getTransactionType, getIconByStatus } = useGetTxDetails();

  const goToTransactionDetails = (path: string) => {
    history.push(path);
  };

  useEffect(() => {
    setTxLogItems(TxLogService.load().filter((tx) => dayjs(tx.completedTime).date() >= dayjs().date()));
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
                    amountCents,
                    override,
                    transactionType,
                    surchargeAmount,
                    bankCashAmount,
                    tipAmount,
                  }) => (
                    <TableRow key={posRefId} onClick={() => goToTransactionDetails(`${PATH_TRANSACTIONS}/${posRefId}`)}>
                      {posRefId && (
                        <>
                          <TableCell>
                            <div className={classes.iconContainer}>
                              {getIconByStatus(override ? SuccessState.Unknown : successState)}
                            </div>
                          </TableCell>
                          <TableCell>{dayjs(completedTime).format('hh:mm A')}</TableCell>
                          <TableCell>{getTransactionType(type, transactionType)}</TableCell>
                          <TableCell>{posId}</TableCell>
                          <TableCell>{tid}</TableCell>
                          <TableCell>
                            {type === 'CashoutOnly'
                              ? calculateCashoutOnlyTotalAmount({
                                  amountCents,
                                  surchargeAmount,
                                  bankCashAmount,
                                  tipAmount,
                                })
                              : calculateTotalAmount({ amountCents, surchargeAmount, bankCashAmount, tipAmount })}
                          </TableCell>
                        </>
                      )}
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
