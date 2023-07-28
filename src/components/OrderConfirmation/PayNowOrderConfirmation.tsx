import React from 'react';
import { Box, Button, Divider, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import useStyles from './index.styles';
import {
  orderCashoutAmountSelector,
  orderKeypadAmountSelector,
  orderPromptForCashoutSelector,
  orderSurchargeAmountSelector,
  orderTipAmountSelector,
  productSubTotalSelector,
} from '../../redux/reducers/ProductSlice/productSelector';
import { initiateMotoPurchase, initiatePurchase } from '../../utils/common/purchase/purchaseHelper';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import { IProps } from './interfaces';

export const PayNowOrderConfirmation: React.FC<IProps> = ({
  isDisabled,
  setShowTransactionProgressModal,
  totalAmount,
}) => {
  const classes = useStyles();
  const surchargeAmount: number = useSelector(orderSurchargeAmountSelector);
  const tipAmount: number = useSelector(orderTipAmountSelector);
  const cashoutAmount: number = useSelector(orderCashoutAmountSelector);
  const promptForCashout: boolean = useSelector(orderPromptForCashoutSelector);
  const subtotalAmount = useSelector(productSubTotalSelector);
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const keyPadAmount = useSelector(orderKeypadAmountSelector);

  return (
    <>
      <Typography className={classes.label}>Select payment method</Typography>
      <Divider />
      <Box display="flex" justifyContent="space-evenly">
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={isDisabled()}
          focusRipple
          classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
          onClick={() => {
            console.log('subtotalAmount', subtotalAmount);
            console.log('keyPadAmount', keyPadAmount);
            setShowTransactionProgressModal(true);
            initiatePurchase(
              selectedTerminal,
              // subtotalAmount || keyPadAmount,
              totalAmount,
              tipAmount,
              cashoutAmount,
              surchargeAmount,
              promptForCashout
            );
          }}
        >
          Card
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={isDisabled() || tipAmount > 0 || cashoutAmount > 0}
          focusRipple
          classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
          onClick={() => {
            setShowTransactionProgressModal(true);
            initiateMotoPurchase(selectedTerminal, subtotalAmount, surchargeAmount);
          }}
        >
          Moto
        </Button>
      </Box>
    </>
  );
};
