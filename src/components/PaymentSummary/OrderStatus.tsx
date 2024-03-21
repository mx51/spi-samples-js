import { Divider, Typography } from '@material-ui/core';
import React from 'react';
import { SuccessState } from '@mx51/spi-client-js';
import dayjs from 'dayjs';
import { TxLogItem } from '../../services/txLogService';
import { useTransactionDetailPageStyle } from '../TransactionPage/TransactionDetailsPage/TransactionDetailsPage.style';
import { useGetTxDetails } from '../TransactionPage/useGetTxDetails';

type Props = {
  currentTransaction: TxLogItem;
};

export const OrderStatus = ({ currentTransaction }: Props) => {
  const classes = useTransactionDetailPageStyle();
  const { override, successState, type, completedTime } = currentTransaction;
  const { getIconByStatus, getStatus } = useGetTxDetails();

  return (
    <div>
      <div className={classes.iconContainer}>{getIconByStatus(override ? SuccessState.Unknown : successState)}</div>
      <Typography variant="h6" component="h1">
        {getStatus(override ? SuccessState.Unknown : successState)}
      </Typography>
      <Typography variant="h6" component="h1">
        {type.toUpperCase()}
      </Typography>
      <Typography className={classes.heading}>{dayjs(completedTime).format('hh:mm A')}</Typography>
      <Divider className={classes.divider} variant="middle" />
    </div>
  );
};
