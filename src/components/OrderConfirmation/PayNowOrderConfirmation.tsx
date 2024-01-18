import React from 'react';
import { Box, Button, Divider, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { SpiStatus } from '@mx51/spi-client-js';
import useStyles from './index.styles';
import {
  orderCashoutAmountSelector,
  orderPromptForCashoutSelector,
  orderSurchargeAmountSelector,
  orderTipAmountSelector,
  productSubTotalSelector,
} from '../../redux/reducers/ProductSlice/productSelector';
import { initiateMotoPurchase, initiatePurchase } from '../../utils/common/purchase/purchaseHelper';
import { IProps } from './interfaces';

export const PayNowOrderConfirmation: React.FC<IProps> = ({ setShowTransactionProgressModal, selectedTerminal }) => {
  const classes = useStyles();
  const surchargeAmount: number = useSelector(orderSurchargeAmountSelector);
  const tipAmount: number = useSelector(orderTipAmountSelector);
  const cashoutAmount: number = useSelector(orderCashoutAmountSelector);
  const subtotalAmount = useSelector(productSubTotalSelector);
  const promptForCashout = useSelector(orderPromptForCashoutSelector);

  const selectedTerminalId = selectedTerminal?.serialNumber;

  return (
    <>
      <Typography className={classes.label}>Select payment method</Typography>
      <Divider />
      <Box display="flex" justifyContent="space-evenly">
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={subtotalAmount <= 0 || !selectedTerminal}
          focusRipple
          classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
          onClick={() => {
            setShowTransactionProgressModal(true);
            initiatePurchase(
              selectedTerminalId!,
              subtotalAmount,
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
          disabled={subtotalAmount <= 0 || tipAmount > 0 || cashoutAmount > 0 || !selectedTerminal}
          focusRipple
          classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
          onClick={() => {
            setShowTransactionProgressModal(true);
            initiateMotoPurchase(selectedTerminalId!, subtotalAmount, surchargeAmount);
          }}
        >
          Moto
        </Button>
      </Box>
    </>
  );
};
