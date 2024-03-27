import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { TxLogItem } from '../../services/txLogService';
import { useTransactionDetailPageStyle } from '../TransactionPage/TransactionDetailsPage/TransactionDetailsPage.style';

type Props = {
  currentTransaction: TxLogItem;
};

export const OrderInfo = ({ currentTransaction }: Props) => {
  const classes = useTransactionDetailPageStyle();
  const { posRefId, posId, tid, mid } = currentTransaction;

  return (
    <div className={classes.orderInfo}>
      <Typography component="code">
        <div>POS Ref ID:</div>
      </Typography>
      <Box bgcolor="rgba(234, 236, 240, 1)" paddingX={1} width="max-content" borderRadius={4} overflow="auto">
        <Typography variant="body2" component="code">
          {posRefId}
        </Typography>
      </Box>
      <Typography className={classes.body}>POS ID:</Typography>
      <Box bgcolor="rgba(234, 236, 240, 1)" paddingX={1} width="max-content" borderRadius={4} overflow="auto">
        <Typography variant="body2" component="code">
          {posId}
        </Typography>
      </Box>
      <Typography className={classes.body}>TID:</Typography>
      <Box bgcolor="rgba(234, 236, 240, 1)" paddingX={1} width="max-content" borderRadius={4} overflow="auto">
        <Typography variant="body2" component="code">
          {tid}
        </Typography>
      </Box>
      <Typography className={classes.body}>MID:</Typography>
      <Box bgcolor="rgba(234, 236, 240, 1)" paddingX={1} width="max-content" borderRadius={4} overflow="auto">
        <Typography variant="body2" component="code">
          {mid}
        </Typography>
      </Box>
    </div>
  );
};
