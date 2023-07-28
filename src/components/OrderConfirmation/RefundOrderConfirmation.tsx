import { Box, Button } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { initiateRefundTx } from '../../utils/common/purchase/purchaseHelper';
import { IProps } from './interfaces';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import useStyles from './index.styles';

export const RefundOrderConfirmation: React.FC<IProps> = ({
  isDisabled,
  totalAmount,
  setShowTransactionProgressModal,
}) => {
  const classes = useStyles();
  const selectedTerminal = useSelector(selectedTerminalIdSelector);

  return (
    <Box display="flex" justifyContent="space-evenly">
      <Button
        variant="contained"
        color="primary"
        size="large"
        disabled={isDisabled()}
        focusRipple
        classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
        onClick={() => {
          setShowTransactionProgressModal(true);
          initiateRefundTx(selectedTerminal, totalAmount);
        }}
      >
        Refund
      </Button>
    </Box>
  );
};
