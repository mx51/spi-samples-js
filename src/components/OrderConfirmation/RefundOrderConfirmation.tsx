import { Box, Button } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { initiateRefundTx } from '../../utils/common/purchase/purchaseHelper';
import { IProps } from './interfaces';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import useStyles from './index.styles';
import { orderRefundAmountSelector } from '../../redux/reducers/ProductSlice/productSelector';

const RefundOrderConfirmationComponent: React.FC<IProps> = ({ setShowTransactionProgressModal }) => {
  const classes = useStyles();
  const selectedTerminalId = useSelector(selectedTerminalIdSelector);
  const refundAmount: number = useSelector(orderRefundAmountSelector);

  return (
    <Box display="flex" justifyContent="space-evenly">
      <Button
        variant="contained"
        color="primary"
        size="large"
        disabled={refundAmount <= 0 || !selectedTerminalId}
        focusRipple
        classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
        onClick={() => {
          setShowTransactionProgressModal(true);
          initiateRefundTx(selectedTerminalId, refundAmount);
        }}
      >
        Refund
      </Button>
    </Box>
  );
};

export const RefundOrderConfirmation = React.memo(RefundOrderConfirmationComponent, () => true);
