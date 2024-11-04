import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Button } from '@material-ui/core';
import { IProps } from './interfaces';
import useStyles from './index.styles';
import { initiateCashoutOnlyTx } from '../../utils/common/purchase/purchaseHelper';
import {
  orderCashoutAmountSelector,
  orderSurchargeAmountSelector,
} from '../../redux/reducers/ProductSlice/productSelector';

export const CashoutOrderConfirmation: React.FC<IProps> = ({ setShowTransactionProgressModal, transactionHandler }) => {
  const classes = useStyles();
  const surchargeAmount: number = useSelector(orderSurchargeAmountSelector);
  const cashoutAmount: number = useSelector(orderCashoutAmountSelector);

  return (
    <Box display="flex" justifyContent="space-evenly">
      <Button
        variant="contained"
        color="primary"
        size="large"
        disabled={cashoutAmount <= 0 || !transactionHandler}
        focusRipple
        classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
        onClick={() => {
          setShowTransactionProgressModal(true);
          initiateCashoutOnlyTx(transactionHandler!.terminalId!, cashoutAmount, surchargeAmount);
        }}
      >
        Cashout
      </Button>
    </Box>
  );
};
