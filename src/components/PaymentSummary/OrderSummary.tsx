import { Divider, Typography } from '@material-ui/core';
import React from 'react';
import OrderLineItem from '../OrderLineItem';
import OrderSubTotal from '../OrderSubTotal';
import currencyFormat from '../../utils/common/intl/currencyFormatter';
import { TxLogItem } from '../../services/txLogService';
import { useTransactionDetailPageStyle } from '../TransactionPage/TransactionDetailsPage/TransactionDetailsPage.style';

type Props = {
  currentTransaction: TxLogItem;
  isCashoutOnly: boolean;
};

export const OrderSummary = ({ currentTransaction, isCashoutOnly }: Props) => {
  const classes = useTransactionDetailPageStyle();
  const { amountCents, surchargeAmount, bankCashAmount, tipAmount, total } = currentTransaction;

  return (
    <div className={classes.summary}>
      <Divider className={classes.divider} variant="middle" />
      <Typography className={classes.heading}>Order Summary</Typography>
      <Typography variant="h6" component="h1" data-testid="total">
        {currencyFormat(total / 100)}
      </Typography>
      <OrderSubTotal label="Subtotal" amount={amountCents} data-testid="subTotal" />
      {surchargeAmount ? (
        <OrderLineItem disabled label="Surcharge" amount={surchargeAmount} viewOnly data-testid="surcharge" />
      ) : null}
      {!isCashoutOnly && bankCashAmount ? (
        <OrderLineItem
          disabled
          label="Cashout"
          amount={isCashoutOnly ? 0 : bankCashAmount}
          viewOnly
          data-testid="cashout"
        />
      ) : null}
      {tipAmount ? <OrderLineItem disabled label="Tip" amount={tipAmount} viewOnly data-testid="tip" /> : null}
    </div>
  );
};
