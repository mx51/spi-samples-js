import { Box, Button } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { SpiStatus } from '@mx51/spi-client-js';
import { initiateRefundTx } from '../../utils/common/purchase/purchaseHelper';
import { IProps } from './interfaces';
import useStyles from './index.styles';
import { orderRefundAmountSelector } from '../../redux/reducers/ProductSlice/productSelector';

const RefundOrderConfirmationComponent: React.FC<IProps> = ({ setShowTransactionProgressModal, selectedTerminal }) => {
  const classes = useStyles();
  const refundAmount: number = useSelector(orderRefundAmountSelector);

  return (
    <Box display="flex" justifyContent="space-evenly">
      <Button
        variant="contained"
        color="primary"
        size="large"
        disabled={refundAmount <= 0 || !selectedTerminal || selectedTerminal.status !== SpiStatus.PairedConnected}
        focusRipple
        classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
        onClick={() => {
          setShowTransactionProgressModal(true);
          initiateRefundTx(selectedTerminal!.serialNumber!, refundAmount);
        }}
      >
        Refund
      </Button>
    </Box>
  );
};

export const RefundOrderConfirmation = React.memo(RefundOrderConfirmationComponent, () => true);
