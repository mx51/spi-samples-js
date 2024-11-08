import { Box, Button } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { initiateRefundTx } from '../../utils/common/purchase/purchaseHelper';
import { IProps } from './interfaces';
import useStyles from './index.styles';
import { orderRefundAmountSelector } from '../../redux/reducers/ProductSlice/productSelector';

export const RefundOrderConfirmation: React.FC<IProps> = ({ setShowTransactionProgressModal, transactionHandler }) => {
  const classes = useStyles();
  const refundAmount: number = useSelector(orderRefundAmountSelector);

  return (
    <Box display="flex" justifyContent="space-evenly">
      <Button
        variant="contained"
        color="primary"
        size="large"
        disabled={refundAmount <= 0 || !transactionHandler}
        focusRipple
        classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
        onClick={() => {
          setShowTransactionProgressModal(true);
          initiateRefundTx(transactionHandler!.terminalId!, refundAmount);
        }}
      >
        Refund
      </Button>
    </Box>
  );
};
