import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Button } from '@material-ui/core';
import { IProps } from './interfaces';
import useStyles from './index.styles';
import { initiateCashoutOnlyTx } from '../../utils/common/purchase/purchaseHelper';
import { orderSurchargeAmountSelector } from '../../redux/reducers/ProductSlice/productSelector';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';

export const CashoutOrderConfirmation: React.FC<IProps> = ({
  isDisabled,
  totalAmount,
  setShowTransactionProgressModal,
}) => {
  const classes = useStyles();
  const surchargeAmount: number = useSelector(orderSurchargeAmountSelector);
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
          initiateCashoutOnlyTx(selectedTerminal, totalAmount, surchargeAmount);
        }}
      >
        Cashout
      </Button>
    </Box>
  );
};
