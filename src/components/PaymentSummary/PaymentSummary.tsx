import { Box, Button, Container, Grid } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TxLogItem } from '../../services/txLogService';
import { useTransactionDetailPageStyle } from '../TransactionPage/TransactionDetailsPage/TransactionDetailsPage.style';
import { OrderStatus } from './OrderStatus';
import { OrderSummary } from './OrderSummary';
import CustomContentPanel from '../CustomContentPanel';

import { PATH_TRANSACTIONS } from '../../definitions/constants/routerConfigs';
import { OrderInfo } from './OrderInfo';
import { SplitSummary } from './SplitSummary';
import { OrderButtons } from './OrderButtons';
import { clearAllProducts } from '../../redux/reducers/ProductSlice/productSlice';

type Props = {
  currentTransaction: TxLogItem;
  transactionHistory?: boolean;
  splitTransaction?: {
    // currentSplitNumber: number;
    // totalSplitNumber: number;
    splitAmount: number;
    outstandingAmount: number;
    onClickNext: () => void;
    splitMode: string;
    numberOfSplits: number;
    splitIndex: number;
  };
  typePath?: string;
};

export const PaymentSummary = ({ currentTransaction, transactionHistory, splitTransaction, typePath }: Props) => {
  const classes = useTransactionDetailPageStyle();
  const { receipt, hostResponseText } = currentTransaction;
  const history = useHistory();
  const dispatch = useDispatch();

  const goToTransactions = (path: string) => {
    history.push(path);
  };

  useEffect(() => {
    dispatch(clearAllProducts());
  }, []);

  const isCashoutOnly = currentTransaction?.type === 'CashoutOnly';

  return (
    <Container className={classes.container} maxWidth="md">
      {transactionHistory ? (
        <Button className={classes.backLink} onClick={() => goToTransactions(PATH_TRANSACTIONS)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#393F73" />
          </svg>
          Back to Transaction history
        </Button>
      ) : null}
      <Grid container spacing={1} className={classes.gridContainer}>
        <Grid item xs={6} className={classes.gridItem}>
          <Box className={classes.root}>
            <Box flexGrow="2" className={classes.roots}>
              <OrderStatus currentTransaction={currentTransaction} />

              {splitTransaction ? (
                <SplitSummary
                  splitAmount={splitTransaction.splitAmount}
                  outstandingAmount={splitTransaction.outstandingAmount}
                  splitIndex={splitTransaction.splitIndex}
                  splitMode="splitEvenly"
                  numberOfSplits={splitTransaction.numberOfSplits}
                />
              ) : (
                <OrderInfo currentTransaction={currentTransaction} />
              )}

              <OrderSummary currentTransaction={currentTransaction} isCashoutOnly={isCashoutOnly} />

              {transactionHistory ? null : <OrderButtons typePath={typePath} splitTransaction={splitTransaction} />}
            </Box>
          </Box>
        </Grid>
        <Grid className={classes.gridItem}>
          <CustomContentPanel title="Receipt" css={classes.receiptBoxWrapper} isCopiable content={receipt}>
            <pre>{receipt || hostResponseText}</pre>
          </CustomContentPanel>
        </Grid>
      </Grid>
    </Container>
  );
};
