import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, Button, Container, Divider, Grid, Typography } from '@material-ui/core';
import dayjs from 'dayjs';
import { SuccessState } from '@mx51/spi-client-js';
import { useTransactionDetailPageStyle } from './TransactionDetailsPage.style';
import { PATH_TRANSACTIONS } from '../../../definitions/constants/routerConfigs';
import { TxLogItem, TxLogService } from '../../../services/txLogService';
import Layout from '../../Layout';
import OrderSubTotal from '../../OrderSubTotal';
import OrderLineItem from '../../OrderLineItem';
import ReceiptPanel from '../../ReceiptPanel';
import { useGetTxDetails } from '../useGetTxDetails';
import currencyFormat from '../../../utils/common/intl/currencyFormatter';

export const TransactionDetailsPage: React.FC = () => {
  const classes = useTransactionDetailPageStyle();
  const { pathname } = useLocation();
  const history = useHistory();
  const currentTransactionId = pathname?.split(`${PATH_TRANSACTIONS}/`)[1];
  const [currentTransaction, setcurrentTransaction] = useState<TxLogItem>();
  const { getTransactionType, getIconByStatus, getStatus } = useGetTxDetails();

  const goToTransactions = (path: string) => {
    history.push(path);
  };

  useEffect(() => {
    if (!currentTransaction) {
      setcurrentTransaction(TxLogService.findTxByPosRefId(currentTransactionId));
    }
  }, [currentTransaction]);

  if (!currentTransaction) return <div>Could not load transaction.</div>;

  const isCashoutOnly = currentTransaction?.type === 'CashoutOnly';

  return (
    <Layout>
      <Container className={classes.container} maxWidth="md">
        <Button className={classes.backLink} onClick={() => goToTransactions(PATH_TRANSACTIONS)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#393F73" />
          </svg>
          Back to Transaction history
        </Button>
        <Grid container spacing={1} className={classes.gridContainer}>
          <>
            <Grid item xs={6} className={classes.gridItem}>
              <Box className={classes.root}>
                <Box flexGrow="2" className={classes.roots}>
                  <div className={classes.iconContainer}>
                    {getIconByStatus(
                      currentTransaction.override ? SuccessState.Unknown : currentTransaction.successState
                    )}
                  </div>
                  <Typography variant="h6" component="h1">
                    {getStatus(currentTransaction.override ? SuccessState.Unknown : currentTransaction.successState)}
                  </Typography>
                  <Typography variant="h6" component="h1">
                    {getTransactionType(currentTransaction.type, currentTransaction.transactionType).toUpperCase()}
                  </Typography>
                  <Typography className={classes.heading}>
                    {dayjs(currentTransaction.completedTime).format('hh:mm A')}
                  </Typography>
                  <Divider className={classes.divider} variant="middle" />
                  <Typography>
                    <div>POS Ref ID</div>
                    <div>{currentTransaction?.posRefId}</div>
                  </Typography>
                  <Typography className={classes.body}>POS ID: {currentTransaction?.posId} </Typography>
                  <Typography className={classes.body}>TID: {currentTransaction?.tid} </Typography>
                  <Typography className={classes.body}>MID: {currentTransaction?.mid} </Typography>
                  <Divider className={classes.divider} variant="middle" />
                  <Typography className={classes.heading}>Order Summary</Typography>
                  <Typography variant="h6" component="h1">
                    {currencyFormat(currentTransaction.total / 100)}
                  </Typography>
                  <OrderSubTotal label="Subtotal" amount={currentTransaction.amountCents} />
                  {currentTransaction.surchargeAmount ? (
                    <OrderLineItem disabled label="Surcharge" amount={currentTransaction.surchargeAmount} viewOnly />
                  ) : null}
                  {!isCashoutOnly && currentTransaction.bankCashAmount ? (
                    <OrderLineItem
                      disabled
                      label="Cashout"
                      amount={isCashoutOnly ? 0 : currentTransaction.bankCashAmount}
                      viewOnly
                    />
                  ) : null}
                  {currentTransaction.tipAmount ? (
                    <OrderLineItem disabled label="Tip" amount={currentTransaction.tipAmount} viewOnly />
                  ) : null}
                </Box>
              </Box>
            </Grid>
            <Grid className={classes.gridItem}>
              <ReceiptPanel title="Receipt" css={classes.receiptBoxWrapper} textReceipt={currentTransaction.receipt}>
                <pre>{currentTransaction.receipt || currentTransaction.hostResponseText}</pre>
              </ReceiptPanel>
            </Grid>
          </>
        </Grid>
      </Container>
    </Layout>
  );
};

